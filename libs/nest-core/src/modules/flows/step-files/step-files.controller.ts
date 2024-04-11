import { RequestWorker } from '@linkerry/shared'
import { Body, Controller, Delete, Get, Header, Param, Post, Query, Request, Response, UseGuards } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtBearerTokenAuthGuard } from '../../../lib/auth'
import { ReqJwtWorker } from '../../users/auth/decorators/req-jwt-worker.decorator'
import { CreateDto } from './dto/create.dto'
import { StepFilesService } from './step-files.service'

@Controller('step-files')
export class StepFilesController {
	constructor(private readonly stepFilesService: StepFilesService) {}

	@Header('Content-Type', 'application/octet-stream')
	@Get('/signed')
	async getByToken(@Query('token') token: string, @Response({ passthrough: true }) response: FastifyReply) {
		const stepFile = await this.stepFilesService.getByToken(token)

		response.header('Content-Disposition', `attachment; filename="${stepFile?.name}"`)

		return stepFile
	}

	@Header('Content-Type', 'application/octet-stream')
	@UseGuards(JwtBearerTokenAuthGuard)
	@Get(':id')
	async findOne(@ReqJwtWorker() worker: RequestWorker, @Param('id') id: string, @Response({ passthrough: true }) response: FastifyReply) {
		const stepFile = await this.stepFilesService.get({
			id,
			projectId: worker.projectId,
		})

		response.header('Content-Disposition', `attachment; filename="${stepFile?.name}"`)

		return stepFile
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Post()
	async create(@ReqJwtWorker() worker: RequestWorker, @Body() body: CreateDto, @Request() request: FastifyRequest) {
		return this.stepFilesService.upsert({
			projectId: worker.projectId,
			request: body,
			hostname: request.hostname,
		})
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@Delete(':id')
	async delete(@ReqJwtWorker() worker: RequestWorker, @Param('id') id: string) {
		return this.stepFilesService.delete({
			id,
			projectId: worker.projectId,
		})
	}
}
