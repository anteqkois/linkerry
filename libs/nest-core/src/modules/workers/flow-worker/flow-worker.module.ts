import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EngineModule } from '../../engine/engine.module'
import { FilesModule } from '../../files/files.module'
import { ConnectorsMetadataModule } from '../../flows/connectors/connectors-metadata/connectors-metadata.module'
import { FlowRunsModule } from '../../flows/flow-runs/flow-runs.module'
import { FlowRunModelFactory } from '../../flows/flow-runs/schemas/flow-runs.schema'
import { FlowVersionsModule } from '../../flows/flow-versions/flow-versions.module'
import { flowVersionModelFactory } from '../../flows/flow-versions/schemas/flow-version.schema'
import { FlowsModule } from '../../flows/flows/flows.module'
import { FlowModelFactory } from '../../flows/flows/schemas/flow.schema'
import { TriggerHooksModule } from '../../flows/triggers/trigger-hooks/trigger-hooks.module'
import { SandboxModule } from '../sandbox/sandbox.module'
import { FlowWorkerHooks } from './flow-worker.hooks'
import { FlowWorkerService } from './flow-worker.service'
import { FlowJobProcessor } from './flow-job.processor'
import { OneTimeProcessor } from './one-time-job.processor'
import { QueuesService } from './queues/queues.service'
import { QUEUES } from './queues/types'
import { DedupeModule } from '../../flows/triggers/dedupe/dedupe.module'

const EIGHT_MINUTES_IN_MILLISECONDS = 8 * 60 * 1000
const defaultJobOptions: RegisterQueueOptions['defaultJobOptions'] = {
	attempts: 5,
	backoff: {
		type: 'exponential',
		delay: EIGHT_MINUTES_IN_MILLISECONDS,
	},
	removeOnComplete: true,
}

@Module({
	imports: [
		MongooseModule.forFeatureAsync([flowVersionModelFactory, FlowModelFactory, FlowRunModelFactory]),
		FlowRunsModule,
		FlowsModule,
		TriggerHooksModule,
		FlowVersionsModule,
		SandboxModule,
		EngineModule,
		FilesModule,
		DedupeModule,
		ConnectorsMetadataModule,
		BullModule.registerQueue({
			configKey: QUEUES.CONFIG_KEYS.FLOW,
			name: QUEUES.NAMES.ONE_TIME_JOB_QUEUE,
			defaultJobOptions,
		}),
		BullModule.registerQueue({
			configKey: QUEUES.CONFIG_KEYS.FLOW,
			name: QUEUES.NAMES.SCHEDULED_JOB_QUEUE,
			defaultJobOptions,
		}),
	],
	providers: [FlowJobProcessor, OneTimeProcessor, QueuesService, FlowWorkerService, FlowWorkerHooks],
})
export class FlowWorkerModule {}
