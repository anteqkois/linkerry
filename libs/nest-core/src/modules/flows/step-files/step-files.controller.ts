import { RequestWorker, StepFileUpsertInput, stepFileUpsertInputSchema, stringShortSchema } from '@linkerry/shared'
import { Controller, Delete, Get, Header, Post, Request, Response, UseGuards } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtBearerTokenAuthGuard } from '../../../lib/auth'
import { BodySchema } from '../../../lib/nest-utils/decorators/zod/body.decorator'
import { ParamIdSchema } from '../../../lib/nest-utils/decorators/zod/id.decorator'
import { QuerySchema } from '../../../lib/nest-utils/decorators/zod/query.decorator'
import { ReqJwtWorker } from '../../users/auth/decorators/req-jwt-worker.decorator'
import { StepFilesService } from './step-files.service'

@Controller('step-files')
export class StepFilesController {
  constructor(private readonly stepFilesService: StepFilesService) {}

  @Header('Content-Type', 'application/octet-stream')
  @Get('/signed')
  async getByToken(@QuerySchema('token', stringShortSchema) token: string, @Response({ passthrough: true }) response: FastifyReply) {
    const stepFile = await this.stepFilesService.getByToken(token)

    response.header('Content-Disposition', `attachment; filename="${stepFile?.name}"`)

    return stepFile
  }

  @Header('Content-Type', 'application/octet-stream')
  @UseGuards(JwtBearerTokenAuthGuard)
  @Get(':id')
  async findOne(@ParamIdSchema() id: string, @ReqJwtWorker() worker: RequestWorker, @Response({ passthrough: true }) response: FastifyReply) {
    const stepFile = await this.stepFilesService.get({
      id,
      projectId: worker.projectId,
    })

    response.header('Content-Disposition', `attachment; filename="${stepFile?.name}"`)

    return stepFile
  }

  @UseGuards(JwtBearerTokenAuthGuard)
  @Post()
  async create(
    @BodySchema(stepFileUpsertInputSchema) body: StepFileUpsertInput,
    @ReqJwtWorker() worker: RequestWorker,
    @Request() request: FastifyRequest,
  ) {
    return this.stepFilesService.upsert({
      projectId: worker.projectId,
      request: body,
      hostname: request.hostname,
    })
  }

  @UseGuards(JwtBearerTokenAuthGuard)
  @Delete(':id')
  async delete(@ParamIdSchema() id: string, @ReqJwtWorker() worker: RequestWorker) {
    return this.stepFilesService.delete({
      id,
      projectId: worker.projectId,
    })
  }
}
