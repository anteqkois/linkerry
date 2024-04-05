import { ConnectorMetadata, ConnectorPropertyMap } from '@linkerry/connectors-framework'
import {
	ActionConnectorSettings,
	ActionType,
	CustomError,
	ErrorCode,
	FlowOperationRequest,
	FlowOperationType,
	FlowVersion,
	FlowVersionState,
	Id,
	TriggerType,
	assertNotNullOrUndefined,
	clone,
	flowHelper,
	generateEmptyTrigger,
	isNil,
} from '@linkerry/shared'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { MongoFilter } from '../../../lib/mongodb/decorators/filter.decorator'
import { WebhookSimulationService } from '../../webhooks/webhook-simulation/webhook-simulation.service'
import { ConnectorsMetadataService } from '../connectors/connectors-metadata/connectors-metadata.service'
import { StepFilesService } from '../step-files/step-files.service'
import { FlowVersionDocument, FlowVersionModel } from './schemas/flow-version.schema'

@Injectable()
export class FlowVersionsService {
	private readonly logger = new Logger(FlowVersionsService.name)

	constructor(
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		private readonly webhookSimulationService: WebhookSimulationService,
		private readonly stepFilesService: StepFilesService,
		private readonly connectorsMetadataService: ConnectorsMetadataService,
	) {}

	private async _deleteWebhookSimulation(params: DeleteWebhookSimulationParams): Promise<void> {
		const { projectId, flowId } = params

		try {
			await this.webhookSimulationService.delete({
				projectId,
				flowId,
			})
		} catch (error: unknown) {
			const notWebhookSimulationNotFoundError = !(error instanceof CustomError && error.code === ErrorCode.ENTITY_NOT_FOUND)
			if (notWebhookSimulationNotFoundError) {
				throw error
			}
		}
	}

	private async _preApplyOperationSideEffect({ projectId, flowVersion, operation }: OnApplyOperationParams) {
		/* disable action was moved to trigger events watcher */
		// if (operation.type === FlowOperationType.UPDATE_TRIGGER) {
		// 	try {
		// 		await this._deleteWebhookSimulation({
		// 			projectId,
		// 			flowId: flowVersion.flow,
		// 		})
		// 	} catch (e) {
		// 		// Ignore error and continue the operation peacefully
		// 		// exceptionHandler.handle(e)
		// 	}
		// }
	}

	private _decorateValidityAndUpdatedBy({ flowVersion, userId }: DecorateValidityUpdatedByParams) {
		flowVersion.updatedBy = userId
		flowVersion.valid = flowHelper.isValid(flowVersion)
		return flowVersion
	}

	private async _applySingleOperation(projectId: Id, flowVersion: FlowVersion, operation: FlowOperationRequest): Promise<FlowVersion> {
		this.logger.debug(`#applySingleOperation ${operation.type} to ${flowVersion.displayName}`)

		await this._preApplyOperationSideEffect({
			projectId,
			flowVersion,
			operation,
		})

		operation = await this._prepareRequest(projectId, flowVersion, operation)
		return flowHelper.apply(flowVersion, operation)
	}

	// TODO add validation
	private async _prepareRequest(projectId: Id, flowVersion: FlowVersion, request: FlowOperationRequest): Promise<FlowOperationRequest> {
		const clonedRequest: FlowOperationRequest = clone(request)

		switch (clonedRequest.type) {
			case FlowOperationType.ADD_ACTION:
				clonedRequest.request.action.valid = true
				switch (clonedRequest.request.action.type) {
					// case ActionType.LOOP_ON_ITEMS:
					// 	clonedRequest.request.action.valid = loopSettingsValidator.Check(clonedRequest.request.action.settings)
					// 	break
					// case ActionType.BRANCH:
					// 	clonedRequest.request.action.valid = branchSettingsValidator.Check(clonedRequest.request.action.settings)
					// 	break
					case ActionType.CONNECTOR:
						clonedRequest.request.action.valid = await this._validateAction({
							settings: clonedRequest.request.action.settings,
							projectId,
						})
						break
					// case ActionType.CODE: {
					// 	break
					// }
				}
				break
			case FlowOperationType.UPDATE_ACTION:
				// clonedRequest.request.valid = true
				switch (clonedRequest.request.type) {
					// case ActionType.LOOP_ON_ITEMS:
					// 	clonedRequest.request.valid = loopSettingsValidator.Check(clonedRequest.request.settings)
					// 	break
					// case ActionType.BRANCH:
					// 	clonedRequest.request.valid = branchSettingsValidator.Check(clonedRequest.request.settings)
					// 	break
					case ActionType.CONNECTOR: {
						// clonedRequest.request.valid = await this._validateAction({
						// 	settings: clonedRequest.request.settings,
						// 	projectId,
						// })
						const previousStep = flowHelper.getStep(flowVersion, clonedRequest.request.name)
						if (
							previousStep !== undefined &&
							previousStep.type === ActionType.CONNECTOR &&
							clonedRequest.request.settings.connectorName !== previousStep.settings.connectorName
						) {
							await this.stepFilesService.deleteAll({
								projectId,
								flowId: flowVersion.flow,
								stepName: previousStep.name,
							})
						}
						break
					}
					// case ActionType.CODE: {
					// 	break
					// }
				}
				break
			case FlowOperationType.DELETE_ACTION: {
				const previousStep = flowHelper.getStep(flowVersion, clonedRequest.request.name)
				if (previousStep !== undefined && previousStep.type === ActionType.CONNECTOR) {
					await this.stepFilesService.deleteAll({
						projectId,
						flowId: flowVersion.flow,
						stepName: previousStep.name,
					})
				}
				break
			}
			case FlowOperationType.UPDATE_TRIGGER:
				switch (clonedRequest.request.type) {
					case TriggerType.EMPTY:
						clonedRequest.request.valid = false
						break
					case TriggerType.CONNECTOR:
						// clonedRequest.request.valid = await validateTrigger({
						// 	settings: clonedRequest.request.settings,
						// 	projectId,
						// })
						break
				}
				break

			default:
				break
		}
		return clonedRequest
	}

	/* STEP VALIDATION */
	private async _validateAction({ projectId, settings }: { projectId: Id; settings: ActionConnectorSettings }): Promise<boolean> {
		if (isNil(settings.connectorName) || isNil(settings.connectorVersion) || isNil(settings.actionName) || isNil(settings.input)) {
			return false
		}

		const connector = (await this.connectorsMetadataService.findOne(settings.connectorName, {
			summary: false,
			version: settings.connectorVersion,
		})) as ConnectorMetadata

		if (isNil(connector)) {
			return false
		}
		const action = connector.actions[settings.actionName]
		if (isNil(action)) {
			return false
		}
		const props = action.props
		if (isNil(props)) return false
		if (!isNil(connector.auth) && action.requireAuth) {
			props['auth'] = connector.auth
		}

		return this._validateProps(props, settings.input)
	}

	private _validateProps(props: ConnectorPropertyMap, input: Record<string, unknown>): boolean {
		//! TODO add props validation
		return false
		// const propsSchema = buildSchema(props)
		// const propsValidator = TypeCompiler.Compile(propsSchema)
		// return propsValidator.Check(input)
	}

	// TODO handle removeSecrets parameter
	async findOne({ filter }: { filter: MongoFilter<FlowVersionDocument> }) {
		return await this.flowVersionModel.findOne(
			filter,
			{},
			{
				sort: {
					createdAt: -1,
				},
			},
		)
	}

	async createEmpty(flowId: Id, projectId: Id, userId: Id) {
		const emptyTrigger = generateEmptyTrigger('trigger_1')

		return this.flowVersionModel.create({
			flow: flowId,
			projectId,
			displayName: 'Untitled',
			state: FlowVersionState.DRAFT,
			valid: false,
			stepsCount: 1,
			triggers: [emptyTrigger],
			actions: [],
			updatedBy: userId,
		})
	}

	async copyVersion(flowVersionId: string): Promise<FlowVersionDocument> {
		const flowVersionToCopy = await this.flowVersionModel.findOne({
			_id: flowVersionId,
		})
		assertNotNullOrUndefined(flowVersionToCopy, 'flowVersionToCopy')
		const { _id, __v, createdAt, updatedAt, ...copiedFlowVersionInput } = clone(flowVersionToCopy.toObject())
		const copiedFlowVersionId = await this.flowVersionModel.create(copiedFlowVersionInput)

		const copiedFlowVersion = await this.flowVersionModel.findOne({ _id: copiedFlowVersionId.id })
		assertNotNullOrUndefined(copiedFlowVersion, 'copiedFlowVersion')
		return copiedFlowVersion
	}

	async deleteRelatedToFlow(flowId: Id) {
		return this.flowVersionModel.deleteMany({
			flowId: flowId,
		})
	}

	async applyOperation({ flowVersion, projectId, userId, userOperation }: ApplyOperationParams): Promise<FlowVersion> {
		let operations: FlowOperationRequest[] = []
		let mutatedFlowVersion: FlowVersion = flowVersion

		switch (userOperation.type) {
			// case FlowOperationType.USE_AS_DRAFT: {
			// 		const previousVersion = await flowVersionService.getFlowVersionOrThrow({
			// 				flow: flowVersion.flowId,
			// 				version: userOperation.request.versionId,
			// 				removeSecrets: false,
			// 		})

			// 		operations = handleImportFlowOperation(flowVersion, previousVersion)
			// 		break
			// }

			// case FlowOperationType.IMPORT_FLOW: {
			// 		operations = handleImportFlowOperation(
			// 				flowVersion,
			// 				userOperation.request,
			// 		)
			// 		break
			// }

			// case FlowOperationType.LOCK_FLOW: {
			// 		mutatedFlowVersion = await this.lockPieceVersions({
			// 				projectId,
			// 				flowVersion: mutatedFlowVersion,
			// 				entityManager,
			// 		})

			// 		operations = [userOperation]
			// 		break
			// }

			// case FlowOperationType.DUPLICATE_ACTION: {
			// 		mutatedFlowVersion = await this.getFlowVersionOrThrow({
			// 				flow: flowVersion.flowId,
			// 				version: flowVersion.id,
			// 		})

			// 		operations = [userOperation]
			// 		break
			// }

			default: {
				operations = [userOperation]
				break
			}
		}

		for (const operation of operations) {
			mutatedFlowVersion = await this._applySingleOperation(projectId, mutatedFlowVersion, operation)
		}

		mutatedFlowVersion = this._decorateValidityAndUpdatedBy({
			flowVersion: mutatedFlowVersion,
			userId,
		})

		const response = await this.flowVersionModel.updateOne(
			{
				_id: flowVersion._id,
				projectId,
			},
			{ $set: mutatedFlowVersion },
		)

		if (!response.modifiedCount) throw new UnprocessableEntityException(`Can not find flow version`)
		return mutatedFlowVersion
	}

	/* OPERATIONS */
	// // TODO move to operation architecture like in AC
	// async updateTrigger(id: Id, projectId: Id, userId: Id, updateTrigger: Trigger) {
	// 	const flowVersion = await this.flowVersionModel.findOne({
	// 		_id: id,
	// 		projectId,
	// 	})
	// 	if (!flowVersion) throw new UnprocessableEntityException(`Can not find flow version`)
	// 	if (!isTrigger(updateTrigger)) throw new UnprocessableEntityException(`Invalid input, expect trigger receive: ${JSON.stringify(updateTrigger)}`)

	// 	switch (updateTrigger.type) {
	// 		case TriggerType.CONNECTOR:
	// 			triggerConnectorSchema.parse(updateTrigger)
	// 			break
	// 		case TriggerType.EMPTY:
	// 			triggerEmptySchema.parse(updateTrigger)
	// 			break
	// 		default:
	// 			throw new UnprocessableEntityException(`Invalid trigger type`)
	// 	}

	// 	// return newFlowVersion

	// 	// const response = await this.flowVersionModel.updateOne(
	// 	// 	{
	// 	// 		_id: id,
	// 	// 		projectId,
	// 	// 	},
	// 	// 	{ $set: newFlowVersion },
	// 	// )

	// 	// if (!response.modifiedCount) throw new UnprocessableEntityException(`Can not find flow version`)
	// 	// return newFlowVersion
	// }

	// async patchTrigger({
	// 	flowVersionId,
	// 	triggerName,
	// 	trigger,
	// 	projectId,
	// 	userId,
	// }: {
	// 	flowVersionId: Id
	// 	triggerName: string
	// 	trigger: Partial<Trigger>
	// 	projectId: Id
	// 	userId: Id
	// }) {
	// 	const flowVersion = await this.flowVersionModel.findById(flowVersionId)
	// 	assertNotNullOrUndefined(flowVersion, 'flowVersion')

	// 	const newFlowVersion = this._decorateValidityAndUpdatedBy({
	// 		flowVersion: flowHelper.patchTrigger(flowVersion.toObject(), triggerName, trigger),
	// 		userId,
	// 	})

	// 	await this.flowVersionModel.updateOne(
	// 		{
	// 			_id: flowVersionId,
	// 			projectId,
	// 		},
	// 		{ $set: newFlowVersion },
	// 	)

	// 	return newFlowVersion
	// }

	// async updateAction(id: Id, projectId: Id, userId: Id, updateAction: Action) {
	// 	switch (updateAction.type) {
	// 		case ActionType.CONNECTOR:
	// 			actionConnectorSchema.parse(updateAction)
	// 			break
	// 		case ActionType.BRANCH:
	// 			actionBranchSchema.parse(updateAction)
	// 			break
	// 		default:
	// 			throw new UnprocessableEntityException(`Invalid trigger type`)
	// 	}

	// 	const flowVersion = await this.flowVersionModel.findOne({
	// 		_id: id,
	// 		projectId,
	// 	})
	// 	assertNotNullOrUndefined(flowVersion, 'flowVersion')

	// 	const newFlowVersion = this._decorateValidityAndUpdatedBy({
	// 		flowVersion: flowHelper.updateAction(flowVersion.toObject(), updateAction),
	// 		userId,
	// 	})

	// 	switch (updateAction.type as ActionType) {
	// 		case ActionType.CONNECTOR:
	// 			// eslint-disable-next-line no-case-declarations
	// 			const step = flowHelper.getStep(flowVersion.toObject(), updateAction.name)

	// 			// delete files when changed connector
	// 			if (step !== undefined && step.type === ActionType.CONNECTOR && updateAction.settings.connectorName !== step.settings.connectorName) {
	// 				await this.stepFilesService.deleteAll({
	// 					projectId,
	// 					flowId: flowVersion.flow.toString(),
	// 					stepName: step.name,
	// 				})
	// 			}

	// 			break
	// 		case ActionType.BRANCH:
	// 		case ActionType.LOOP_ON_ITEMS:
	// 		case ActionType.MERGE_BRANCH:
	// 			throw new CustomError(`Not implemented`, ErrorCode.INVALID_TYPE, {
	// 				type: updateAction.type,
	// 			})
	// 	}

	// 	await this.flowVersionModel.updateOne(
	// 		{
	// 			_id: id,
	// 			projectId,
	// 		},
	// 		{ $set: newFlowVersion },
	// 	)

	// 	return newFlowVersion
	// }

	// // async addAction(id: Id, projectId: Id, userId: Id, { action, parentStepName }: FlowVersionAddActionInput) {
	// async addAction(flowVersion: FlowVersion, { action, parentStepName, stepLocationRelativeToParent }: AddActionRequest) {
	// 	switch (action.type) {
	// 		case ActionType.CONNECTOR:
	// 			actionConnectorSchema.parse(action)
	// 			break
	// 		case ActionType.BRANCH:
	// 			actionBranchSchema.parse(action)
	// 			break
	// 		default:
	// 			throw new UnprocessableEntityException(`Invalid trigger type`)
	// 	}

	// 	// const flowVersion = await this.flowVersionModel.findOne({
	// 	// 	_id: id,
	// 	// 	projectId,
	// 	// })
	// 	// if (!flowVersion) throw new UnprocessableEntityException(`Can not find flow version`)

	// 	return flowHelper.addAction(flowVersion.toObject(), parentStepName, action)
	// }

	// async deleteAction(id: Id, projectId: Id, userId: Id, actionName: string) {
	// 	const flowVersion = await this.flowVersionModel.findOne({
	// 		_id: id,
	// 		projectId,
	// 	})
	// 	assertNotNullOrUndefined(flowVersion, 'flowVersion')

	// 	const newFlowVersion = this._decorateValidityAndUpdatedBy({
	// 		flowVersion: flowHelper.deleteAction(flowVersion.toObject(), actionName),
	// 		userId,
	// 	})

	// 	const step = flowHelper.getStep(flowVersion.toObject(), actionName)
	// 	assertNotNullOrUndefined(step, 'step')
	// 	switch (step.type as ActionType) {
	// 		case ActionType.CONNECTOR:
	// 			// delete files when changed connector
	// 			if (step !== undefined && step.type === ActionType.CONNECTOR) {
	// 				await this.stepFilesService.deleteAll({
	// 					projectId,
	// 					flowId: flowVersion.flow.toString(),
	// 					stepName: step.name,
	// 				})
	// 			}

	// 			break
	// 		case ActionType.BRANCH:
	// 		case ActionType.LOOP_ON_ITEMS:
	// 		case ActionType.MERGE_BRANCH:
	// 	}

	// 	await this.flowVersionModel.updateOne(
	// 		{
	// 			_id: id,
	// 			projectId,
	// 		},
	// 		{ $set: newFlowVersion },
	// 	)

	// 	return newFlowVersion
	// }

	async lockFlowVersionIfNotLocked({ flowVersion, projectId, userId, session }: LockFlowVersionIfNotLockedParams) {
		if (flowVersion.state === FlowVersionState.LOCKED) return flowVersion

		return await this.flowVersionModel
			.findOneAndUpdate(
				{
					_id: flowVersion._id,
					projectId,
				},
				{
					state: FlowVersionState.LOCKED,
					updatedBy: userId,
				},
				{
					new: true,
				},
			)
			.session(session)
	}
}

interface DecorateValidityUpdatedByParams {
	flowVersion: FlowVersion
	userId: Id
}

interface LockFlowVersionIfNotLockedParams {
	flowVersion: FlowVersionDocument
	userId: Id
	projectId: Id
	session: mongoose.mongo.ClientSession
}

type OnApplyOperationParams = {
	projectId: Id
	flowVersion: FlowVersion
	operation: FlowOperationRequest
}

type DeleteWebhookSimulationParams = {
	projectId: Id
	flowId: Id
}

type ApplyOperationParams = {
	userId: Id
	projectId: Id
	flowVersion: FlowVersion
	userOperation: FlowOperationRequest
}
