import { LinkerryFile } from '@linkerry/connectors-framework'
import { isString } from '@linkerry/shared'
import fs from 'fs/promises'
import { EngineConstants } from '../handler/context/engine-constants'

const DB_PREFIX_URL = 'db://'
const FILE_PREFIX_URL = 'file://'
const MEMORY_PREFIX_URL = 'memory://'

export type DefaultFileSystem = 'db' | 'local' | 'memory'

export function createFilesService({
  stepName,
  type,
  flowId,
  workerToken,
}: {
  stepName: string
  type: DefaultFileSystem
  flowId: string
  workerToken: string
}) {
  return {
    async write({ fileName, data }: { fileName: string; data: Buffer }): Promise<string> {
      switch (type) {
        // TODO remove db as it now generates a signed url
        case 'db':
          return writeDbFile({ stepName, flowId, fileName, data, workerToken })
        case 'local':
          return writeLocalFile({ stepName, fileName, data })
        case 'memory':
          return writeMemoryFile({ fileName, data })
      }
    },
  }
}

export function isMemoryFilePath(dbPath: unknown): boolean {
  if (!isString(dbPath)) {
    return false
  }

  return dbPath.startsWith(MEMORY_PREFIX_URL)
}

export function isLinkerryFilePath(dbPath: unknown): dbPath is string {
  if (!isString(dbPath)) {
    return false
  }
  return dbPath.startsWith(FILE_PREFIX_URL) || dbPath.startsWith(DB_PREFIX_URL) || dbPath.startsWith(MEMORY_PREFIX_URL)
}

export async function handleLinkerryFile({ workerToken, path }: { workerToken: string; path: string }) {
  if (path.startsWith(MEMORY_PREFIX_URL)) {
    return readMemoryFile(path)
  }
  // TODO REMOVE DB AS IT NOW GENERATES A SIGNED URL -> note from activepieces
  else if (path.startsWith(DB_PREFIX_URL)) {
    return readDbFile({ workerToken, absolutePath: path })
  } else if (path.startsWith(FILE_PREFIX_URL)) {
    return readLocalFile(path)
  } else {
    throw new Error(`error=local_file_not_found absolute_path=${path}`)
  }
}

async function writeMemoryFile({ fileName, data }: { fileName: string; data: Buffer }): Promise<string> {
  try {
    const base64Data = data.toString('base64')
    const base64String = JSON.stringify({ fileName, data: base64Data })
    return `memory://${base64String}`
  } catch (error) {
    throw new Error(`Error reading file: ${error}`)
  }
}

async function readMemoryFile(absolutePath: string): Promise<LinkerryFile> {
  try {
    const base64String = absolutePath.replace(MEMORY_PREFIX_URL, '')
    const { fileName, data } = JSON.parse(base64String)
    const calcuatedExtension = fileName.includes('.') ? fileName.split('.').pop() : null
    return new LinkerryFile(fileName, Buffer.from(data, 'base64'), calcuatedExtension)
  } catch (error) {
    throw new Error(`Error reading file: ${error}`)
  }
}

async function writeDbFile({
  stepName,
  flowId,
  fileName,
  data,
  workerToken,
}: {
  stepName: string
  flowId: string
  fileName: string
  data: Buffer
  workerToken: string
}): Promise<string> {
  const formData = new FormData()
  formData.append('stepName', stepName)
  formData.append('name', fileName)
  formData.append('flowId', flowId)
  formData.append('file', new Blob([data], { type: 'application/octet-stream' }))

  const response = await fetch(EngineConstants.API_URL + '/v1/step-files', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + workerToken,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to store file ' + response.body)
  }
  const result = await response.json()
  return result.url
}

async function readDbFile({ workerToken, absolutePath }: { workerToken: string; absolutePath: string }): Promise<LinkerryFile> {
  const fileId = absolutePath.replace(DB_PREFIX_URL, '')
  const response = await fetch(EngineConstants.API_URL + `/v1/step-files/${encodeURIComponent(fileId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + workerToken,
    },
  })
  if (!response.ok) {
    throw new Error(`error=db_file_not_found id=${absolutePath}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  const contentDisposition = response.headers.get('Content-Disposition')
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
  const filename = filenameMatch ? filenameMatch[1] : 'unknown'
  const extension = filename.split('.').pop()!
  return new LinkerryFile(filename, Buffer.from(arrayBuffer), extension)
}

async function writeLocalFile({ stepName, fileName, data }: { stepName: string; fileName: string; data: Buffer }): Promise<string> {
  const path = 'tmp/' + stepName + '/' + fileName
  await fs.mkdir('tmp/' + stepName, { recursive: true })
  await fs.writeFile(path, data)
  return FILE_PREFIX_URL + stepName + '/' + fileName
}

async function readLocalFile(absolutePath: string): Promise<LinkerryFile> {
  const path = 'tmp/' + absolutePath.replace(FILE_PREFIX_URL, '')
  const buffer = await fs.readFile(path)
  const filename = absolutePath.split('/').pop()!
  const extension = filename.split('.').pop()!
  return new LinkerryFile(filename, buffer, extension)
}
