import { RequestWorker, StepFileUpsertInput } from '@linkerry/shared'
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, Header, Request, Response, UseGuards } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtBearerTokenAuthGuard } from '../../../lib/auth'
import { ReqJwtWorker } from '../../users/auth/decorators/req-jwt-worker.decorator'
import { StepFilesService } from './step-files.service'

@Controller('step-files')
export class StepFilesController {
	constructor(private readonly stepFilesService: StepFilesService) {}

	@Header('Content-Type', 'application/octet-stream')
	@TypedRoute.Get('/signed')
	async getByToken(@TypedQuery() query: { token: string }, @Response({ passthrough: true }) response: FastifyReply) {
		const stepFile = await this.stepFilesService.getByToken(query.token)

		response.header('Content-Disposition', `attachment; filename="${stepFile?.name}"`)

		return stepFile
	}

	@Header('Content-Type', 'application/octet-stream')
	@UseGuards(JwtBearerTokenAuthGuard)
	@TypedRoute.Get(':id')
	async findOne(@ReqJwtWorker() worker: RequestWorker, @TypedParam('id') id: string, @Response({ passthrough: true }) response: FastifyReply) {
		const stepFile = await this.stepFilesService.get({
			id,
			projectId: worker.projectId,
		})

		response.header('Content-Disposition', `attachment; filename="${stepFile?.name}"`)

		return stepFile
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@TypedRoute.Post()
	async create(@ReqJwtWorker() worker: RequestWorker, @TypedBody() body: StepFileUpsertInput, @Request() request: FastifyRequest) {
		return this.stepFilesService.upsert({
			projectId: worker.projectId,
			request: body,
			hostname: request.hostname,
		})
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@TypedRoute.Delete(':id')
	async delete(@ReqJwtWorker() worker: RequestWorker, @TypedParam('id') id: string) {
		return this.stepFilesService.delete({
			id,
			projectId: worker.projectId,
		})
	}
}
