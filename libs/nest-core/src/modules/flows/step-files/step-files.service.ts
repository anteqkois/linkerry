import { CustomError, ErrorCode, StepFile, StepFileGet, StepFileUpsertInput, isNil } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StepFileDocument, StepFileModel } from './schemas/file'

@Injectable()
export class StepFilesService {
  constructor(@InjectModel(StepFileModel.name) private readonly stepFileModel: Model<StepFileDocument>) {}

  async upsert({ hostname, request, projectId }: { hostname: string; request: StepFileUpsertInput; projectId: string }): Promise<StepFile | null> {
    const bufferFile = request.file as Buffer

    const stepFile = await this.stepFileModel.findOneAndUpdate(
      {
        projectId,
        flowId: request.flowId,
        stepName: request.stepName,
        name: request.name,
      },
      {
        flowId: request.flowId,
        projectId,
        stepName: request.stepName,
        size: bufferFile.byteLength,
        data: bufferFile,
        name: request.name,
      },
      {
        new: true,
        upsert: true,
      },
    )

    // return encrichWithUrl(
    // 		hostname,
    // 		await stepFileRepo.findOneByOrFail({
    // 				id: fileId,
    // 				projectId,
    // 		}),
    // )
    return stepFile.toObject()
  }

  // TODO implement retriving file by JWT token
  async getByToken(token: string): Promise<StepFile | null> {
    return {} as StepFile
    // try {
    // 	const decodedToken = await jwtUtils.decodeAndVerify<FileToken>({
    // 		jwt: token,
    // 		key: await jwtUtils.getJwtSecret(),
    // 	})
    // 	const file = await stepFileRepo.findOneByOrFail({
    // 		id: decodedToken.fileId,
    // 	})
    // 	return file
    // } catch (e) {
    // 	throw new ActivepiecesError({
    // 		code: ErrorCode.INVALID_BEARER_TOKEN,
    // 		params: {
    // 			message: 'invalid token or expired for the step file',
    // 		},
    // 	})
    // }
  }

  async get({ projectId, id }: StepFileGet): Promise<StepFile | null> {
    const file = await this.stepFileModel.findOne({
      _id: id,
      projectId,
    })

    if (isNil(file)) {
      throw new CustomError(`Step file with id ${id} not found`, ErrorCode.ENTITY_NOT_FOUND)
    }

    return file.toObject()
  }

  async delete({ projectId, id }: StepFileGet): Promise<void> {
    await this.stepFileModel.deleteOne({
      _id: id,
      projectId,
    })
  }

  async deleteAll({ projectId, flowId, stepName }: { projectId: string; flowId: string; stepName: string }): Promise<void> {
    await this.stepFileModel.deleteMany({
      projectId,
      flowId,
      stepName,
    })
  }
}

// TODO handle accessing files by JWT token
// async function encrichWithUrl(
// 	hostname: string,
// 	file: StepFile,
// ): Promise<StepFileWithUrl> {
// 	const jwtSecret = await jwtUtils.getJwtSecret()
// 	const accessToken = await jwtUtils.sign({
// 			payload: {
// 					fileId: file.id,
// 			},
// 			expiresInSeconds: 60 * 60 * 24 * 7,
// 			key: jwtSecret,
// 	})
// 	const url = await domainHelper.get().constructApiUrlFromRequest({
// 			domain: hostname,
// 			path: `v1/step-files/signed?token=${accessToken}`,
// 	})
// 	return {
// 			...file,
// 			url,
// 	}
// }
