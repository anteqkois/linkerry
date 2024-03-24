import { BaseStepSettings, CustomError, ErrorCode, Step, assertNotNullOrUndefined, flowHelper, isNil, isStepBaseSettings } from '@linkerry/shared'
import { Separator } from '@linkerry/ui-components/client'
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@linkerry/ui-components/server'
import { useClickOutside } from '@react-hookz/web'
import { useQueries } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { useEditor } from '../useEditor'
import { DynamicValueStep } from './DynamicValueStep'

// export interface DynamicValueModalProps extends HTMLAttributes<HTMLElement> {}

export const DynamicValueModal = () => {
	const { showDynamicValueModal, setShowDynamicValueModal, flow, editedAction, editedTrigger } = useEditor()

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
		if (connectorsMetadata.some((entry) => entry.isFetching || entry.isLoading)) return []
		return avaibleSteps.map((step) => {
			const connectorMetadata = connectorsMetadata.find(
				(connectorMetadata) => connectorMetadata.data?.name === (step.settings as BaseStepSettings).connectorName,
			)?.data
			assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata')
			return { ...step, connectorMetadata }
		})
	}, [connectorsMetadata])

	const ref = useRef(null)

	useClickOutside(ref, () => {
		setShowDynamicValueModal(false)
	})

	return showDynamicValueModal ? (
		<Card
			ref={ref}
			className="fixed -left-[457px] bottom-2 w-112 min-h-[400px] max-h-[400px] overflow-y-scroll overflow-x-hidden duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]"
			data-state={showDynamicValueModal ? 'open' : 'close'}
		>
			<CardHeader className="p-2 flex flex-row justify-between items-center bg-card sticky top-0 border-b">
				<CardTitle>Select dynamic value to insert</CardTitle>
				<Button size={'icon'} variant={'ghost'} onClick={() => setShowDynamicValueModal(false)}>
					<Icons.Close size={'xs'} />
				</Button>
			</CardHeader>
			<CardContent className="px-0 py-1">
				{steps?.map((step, index) => (
					<div key={step.name}>
						<DynamicValueStep connectorMetadata={step.connectorMetadata} step={step} stepIndex={index} />
						<Separator />
					</div>
				))}
			</CardContent>
		</Card>
	) : null
}
