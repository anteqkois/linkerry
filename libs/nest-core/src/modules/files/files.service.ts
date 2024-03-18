import { File, FileCompression, FileType, Id, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { fileCompressor } from '../../lib/helpers/file-compressor'
import { FileDocument, FileModel } from './schemas/files.schema'

@Injectable()
export class FilesService {
	private readonly logger = new Logger(FilesService.name)
	constructor(@InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>) {}

	async save({ fileId, projectId, data, type, compression }: SaveParams): Promise<File> {
		// TODO update to use https://www.mongodb.com/docs/manual/core/gridfs/#when-to-use-gridfs
		if (fileId) {
			const file = await this.fileModel.findByIdAndUpdate(
				fileId,
				{
					projectId,
					// platformId,
					data,
					type,
					compression,
				},
				{
					upsert: true,
					new: true,
				},
			)

			this.logger.verbose(`#save fileId=${file._id} data.length=${data.length}`)

			return file.toObject()
		} else {
			const newFileId = await this.fileModel.create({
				projectId,
				// platformId,
				data,
				type,
				compression,
			})

			const file = await this.fileModel.findById(newFileId)
			assertNotNullOrUndefined(file, 'file')

			this.logger.verbose(`#save fileId=${file._id} data.length=${data.length}`)
			return file.toObject()
		}
	}

	async findOne({ fileId, projectId }: GetOneParams) {
		const filter: FilterQuery<FileDocument> = {
			_id: fileId,
		}

		if (projectId) filter.projectId = projectId

		const file = await this.fileModel.findOne(filter)
		assertNotNullOrUndefined(file, 'file', {
			fileId,
			projectId,
		})

		const decompressedData = await fileCompressor.decompress({
			data: file.data,
			compression: file.compression,
		})
		file.data = decompressedData

		return file
	}

	async delete({ fileId, projectId }: DeleteOneParams): Promise<void> {
		this.logger.verbose(`#delete ${fileId}`)

		const filter: FilterQuery<FileDocument> = {
			_id: fileId,
		}

		if (projectId) filter.projectId = projectId

		await this.fileModel.deleteOne(filter)
	}
}

type SaveParams = {
	fileId?: Id | undefined
	projectId?: Id
	data: Buffer
	type: FileType
	// platformId?: string
	compression: FileCompression
}

type GetOneParams = {
	fileId: Id
	projectId?: Id
}

type DeleteOneParams = {
	fileId: Id
	projectId: Id
}
