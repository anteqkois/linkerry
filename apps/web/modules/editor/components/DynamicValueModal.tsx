import { BaseStepSettings, CustomError, ErrorCode, Step, assertNotNullOrUndefined, flowHelper, isNil, isStepBaseSettings } from '@linkerry/shared'
import { Separator } from '@linkerry/ui-components/client'
import { Card, CardContent, CardHeader, CardTitle } from '@linkerry/ui-components/server'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { useEditor } from '../useEditor'
import { DynamicValueStep } from './DynamicValueStep'

// export interface DynamicValueModalProps extends HTMLAttributes<HTMLElement> {}

export const DynamicValueModal = () => {
	const { showDynamicValueModal, flow, editedAction, editedTrigger } = useEditor()

	const editedStep = useMemo(() => {
		if (!isNil(editedAction)) return editedAction
		else if (!isNil(editedTrigger)) return editedTrigger
	}, [editedAction, editedTrigger])

	const avaibleSteps = useMemo(() => {
		if (!editedStep) return []

		const steps = flowHelper
			.getAllPrependSteps(flow.version, editedStep.name)
			.map((step) => {
				if (!isStepBaseSettings(step.settings)) return
				if (isNil(step.settings.inputUiInfo.currentSelectedData)) return
				return step
			})
			.filter(Boolean) as Step[]

		return steps
	}, [editedStep])

	const connectorsMetadata = useQueries({
		queries: avaibleSteps.map((step) => {
			if (!isStepBaseSettings(step.settings)) throw new CustomError(`invalid settings for step ${step.name}`, ErrorCode.INVALID_TYPE)
			return connectorsMetadataQueryConfig.getOne({
				connectorName: step.settings.connectorName,
				connectorVersion: step.settings.connectorVersion,
			})
		}),
	})

	const steps = useMemo(() => {
		return avaibleSteps.map((step) => {
			const connectorMetadata = connectorsMetadata.find(
				(connectorMetadata) => connectorMetadata.data?.name === (step.settings as BaseStepSettings).connectorName,
			)?.data
			assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata')
			return { ...step, connectorMetadata }
		})
	}, connectorsMetadata)

	return showDynamicValueModal ? (
		<Card className="fixed -left-[457px] bottom-2 w-112 min-h-[400px] max-h-[400px] overflow-y-scroll overflow-x-hidden">
			<CardHeader className="p-4">
				<CardTitle>Select dynamic value to insert</CardTitle>
				{/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
			</CardHeader>
			<Separator />
			<CardContent className="px-0 py-0">
				{steps?.map((step, index) => (
					<DynamicValueStep connectorMetadata={step.connectorMetadata} step={step} key={step.name} stepIndex={index} />
				))}
			</CardContent>
		</Card>
	) : null
}
