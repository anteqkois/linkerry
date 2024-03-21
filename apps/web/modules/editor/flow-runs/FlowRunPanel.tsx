import { CustomError, ErrorCode, StepOutput, assertNotNullOrUndefined, isStepBaseSettings } from '@linkerry/shared'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@linkerry/ui-components/client'
import { P } from '@linkerry/ui-components/server'
import { useQueries } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { useClientQuery } from '../../../libs/react-query'
import { CodeEditor } from '../../../shared/components/Code/CodeEditor'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { flowRunQueryConfig } from '../../flows/flow-runs/query-config'
import { flowVersionQueryConfig } from '../../flows/flows-version/query-config'
import { useEditor } from '../useEditor'
import { StepItem } from './StepItem'

const results = {
	_id: '65f8c0db2f275c301688d5b2',
	projectId: '65daea5f6bb2aea915f90eac',
	flowId: '65f0cb11d0370abe806022a4',
	flowVersionId: '65f0cb11d0370abe806022a5',
	flowDisplayName: 'Untitled',
	status: 'SUCCEEDED',
	startTime: '2024-03-18T22:31:55.479Z',
	environment: 'TESTING',
	createdAt: '2024-03-18T22:31:55.521Z',
	updatedAt: '2024-03-18T22:32:07.403Z',
	__v: 0,
	finishTime: '2024-03-18T22:32:07.402Z',
	logsFileId: '65f8c0e72f275c301688d5b9',
	tasks: 1,
	steps: {
		trigger_1: {
			type: 'CONNECTOR',
			status: 'SUCCEEDED',
			input: {},
			output: {
				id: 'harambe-2',
				coin_id: 34668,
				name: 'Harambe on Solana',
				symbol: 'HARAMBE',
				market_cap_rank: 950,
				thumb: 'https://assets.coingecko.com/coins/images/34668/standard/haram_%281%29.jpg?1705655145',
				small: 'https://assets.coingecko.com/coins/images/34668/small/haram_%281%29.jpg?1705655145',
				large: 'https://assets.coingecko.com/coins/images/34668/large/haram_%281%29.jpg?1705655145',
				slug: 'harambe-on-solana',
				price_btc: 4.4484046664430377e-7,
				score: 4,
				data: {
					price: '$0.03154',
					price_btc: '0.000000444840466644304',
					price_change_percentage_24h: {
						aed: -25.52459469765057,
						ars: -28.15955392609463,
						aud: -25.453983787105123,
						bch: -21.31801659295169,
						bdt: -25.55769401751606,
						bhd: -25.505817774278043,
						bmd: -25.524594697650592,
						bnb: -27.29854317362693,
						brl: -25.656226898872,
						btc: -24.03601703809325,
						cad: -25.466985139501475,
						chf: -25.5375802121273,
						clp: -26.144208367874388,
						cny: -25.551547365800076,
						czk: -25.627387075767626,
						dkk: -25.521156910361743,
						dot: -21.187725245663415,
						eos: -19.635859081275473,
						eth: -23.52761172343724,
						eur: -25.52646628042995,
						gbp: -25.391566605347943,
						gel: -25.524594697650382,
						hkd: -25.511455423506668,
						huf: -24.69682667610468,
						idr: -25.358774500477743,
						ils: -24.868789938073892,
						inr: -25.42639389106333,
						jpy: -25.16883378362959,
						krw: -25.479032407979957,
						kwd: -25.517320998529225,
						lkr: -25.619040102926444,
						ltc: -19.50134626524709,
						mmk: -25.558360027866406,
						mxn: -25.53255329915624,
						myr: -25.61841446732781,
						ngn: -25.37645654443744,
						nok: -25.044480547456132,
						nzd: -25.30018415324151,
						php: -25.295836979108653,
						pkr: -25.546577589747876,
						pln: -25.41452617642647,
						rub: -24.913647432212912,
						sar: -25.536409262874106,
						sek: -25.57983057479728,
						sgd: -25.412635278976026,
						thb: -24.830586516914853,
						try: -25.43352294409184,
						twd: -25.36164862749602,
						uah: -25.345053659525146,
						usd: -25.524594697650592,
						vef: -25.524594697650627,
						vnd: -25.515422851905285,
						xag: -24.503896151040664,
						xau: -24.679280803268508,
						xdr: -25.614730353245825,
						xlm: -21.05104394122394,
						xrp: -22.381905884535662,
						yfi: -22.75687761390929,
						zar: -25.49985031438135,
						bits: -24.03601703809324,
						link: -22.55170960751299,
						sats: -24.03601703809325,
					},
					market_cap: '$31,846,425',
					market_cap_btc: '449.212129187874',
					total_volume: '$2,871,968',
					total_volume_btc: '40.5075946050715',
					sparkline: 'https://www.coingecko.com/coins/34668/sparkline.svg',
					content: null,
				},
			},
		},
		action_2: {
			type: 'CONNECTOR',
			status: 'SUCCEEDED',
			input: {
				non_zero_assets: true,
				auth: '**CENSORED**',
			},
			output: [
				{
					asset: 'BTC',
					free: '0.00000024',
					locked: '0.00000000',
				},
				{
					asset: 'USDT',
					free: '1.37889197',
					locked: '0.00000000',
				},
				{
					asset: 'REN',
					free: '0.81200000',
					locked: '0.00000000',
				},
				{
					asset: 'FET',
					free: '773.00000000',
					locked: '0.00000000',
				},
				{
					asset: 'MATIC',
					free: '112.08780000',
					locked: '0.00000000',
				},
				{
					asset: 'PLN',
					free: '2.72290000',
					locked: '0.00000000',
				},
				{
					asset: 'OCEAN',
					free: '0.14084000',
					locked: '0.00000000',
				},
				{
					asset: 'LUNA',
					free: '0.00235849',
					locked: '0.00000000',
				},
				{
					asset: 'ORN',
					free: '0.05770400',
					locked: '0.00000000',
				},
				{
					asset: 'DEGO',
					free: '82.64729000',
					locked: '0.00000000',
				},
				{
					asset: 'CFX',
					free: '0.59000000',
					locked: '0.00000000',
				},
				{
					asset: 'SHIB',
					free: '52.99',
					locked: '0.00',
				},
				{
					asset: 'GALA',
					free: '2298.69900000',
					locked: '0.00000000',
				},
				{
					asset: 'LUNC',
					free: '5.71641500',
					locked: '0.00000000',
				},
				{
					asset: 'STG',
					free: '166.30000000',
					locked: '0.00000000',
				},
				{
					asset: 'ETHW',
					free: '0.06150080',
					locked: '0.00000000',
				},
				{
					asset: 'SYN',
					free: '0.00190000',
					locked: '0.00000000',
				},
				{
					asset: 'RDNT',
					free: '1427.57100000',
					locked: '0.00000000',
				},
				{
					asset: 'FDUSD',
					free: '0.11221073',
					locked: '0.00000000',
				},
				{
					asset: 'VANRY',
					free: '0.84800000',
					locked: '0.00000000',
				},
			],
		},
	},
}

export const FlowRunPanel = () => {
	const { selectedFlowRunId } = useEditor()
	const [selectedResult, setSelectedResult] = useState<StepOutput>()
	assertNotNullOrUndefined(selectedFlowRunId, 'selectedFlowRunId')
	const [resultInputPanelHeight, setResultInputPanelHeight] = useState(35)
	const [resultOutputPanelHeight, setResultOutputPanelHeight] = useState(35)

	const {
		data: flowRun,
		isFetched: isFetchedFlowRun,
		isLoading: isLoadingFlowRun,
		error: errorFlowRun,
	} = useClientQuery({
		...flowRunQueryConfig.getOne({
			flowRunId: selectedFlowRunId,
		}),
	})

	const {
		data: flowVersion,
		isFetched: isFetchedFlowVersion,
		isLoading: isLoadingFlowVersion,
		error: errorFlowVersion,
	} = useClientQuery({
		...flowVersionQueryConfig.getOne({
			flowVersionId: flowRun?.flowVersionId ?? '',
		}),
		enabled: isFetchedFlowRun && !!flowRun?.flowVersionId,
	})

	const connectorsMetadata = useQueries({
		queries: flowVersion
			? [
					...Object.values(flowVersion.triggers).map((trigger) => {
						if (!isStepBaseSettings(trigger.settings)) throw new CustomError(`invalid settings for step ${trigger.name}`, ErrorCode.INVALID_TYPE)
						return connectorsMetadataQueryConfig.getOne({
							connectorName: trigger.settings.connectorName,
							connectorVersion: trigger.settings.connectorVersion,
						})
					}),
					...Object.values(flowVersion.actions).map((action) => {
						if (!isStepBaseSettings(action.settings)) throw new CustomError(`invalid settings for step ${action.name}`, ErrorCode.INVALID_TYPE)
						return connectorsMetadataQueryConfig.getOne({
							connectorName: action.settings.connectorName,
							connectorVersion: action.settings.connectorVersion,
						})
					}),
			  ]
			: [],
	})

	const steps = useMemo(() => {
		if (isLoadingFlowRun || isLoadingFlowVersion || connectorsMetadata.some((result) => result.isLoading)) return []
		assertNotNullOrUndefined(flowRun?.steps, 'flowRun?.steps')
		return Object.entries(flowRun?.steps).map(([stepName, result]) => {
			if (stepName.startsWith('trigger')) {
				const trigger = flowVersion?.triggers.find((trigger) => trigger.name === stepName)
				if (!isStepBaseSettings(trigger?.settings)) throw new CustomError(`invalid settings for step ${trigger?.name}`, ErrorCode.INVALID_TYPE)
				const connectorMetadata = connectorsMetadata.find((result) => result.data?.name === trigger.settings.connectorName)
				assertNotNullOrUndefined(connectorMetadata?.data, 'connectorMetadata')

				return {
					step: trigger,
					result,
					connectorMetadata: connectorMetadata.data,
				}
			} else if (stepName.startsWith('action')) {
				const action = flowVersion?.actions.find((action) => action.name === stepName)
				if (!isStepBaseSettings(action?.settings)) throw new CustomError(`invalid settings for step ${action?.name}`, ErrorCode.INVALID_TYPE)
				const connectorMetadata = connectorsMetadata.find((result) => result.data?.name === action.settings.connectorName)
				assertNotNullOrUndefined(connectorMetadata?.data, 'connectorMetadata')

				return {
					step: action,
					result,
					connectorMetadata: connectorMetadata.data,
				}
			} else throw new CustomError(`Can not infer step type`, ErrorCode.INVALID_TYPE, steps)
		})
		// console.log('FETCHED')
	}, [isLoadingFlowRun, isLoadingFlowVersion, connectorsMetadata.some((result) => result.isLoading)])

	const onSelectStep = useCallback(
		(stepIndex: number) => {
			console.log('SELECTED INDEX', stepIndex)
			const step = steps[stepIndex]
			setSelectedResult(step.result)
		},
		[steps],
	)

	if (isLoadingFlowRun || isLoadingFlowVersion) return <Spinner />
	if (errorFlowRun) return <ErrorInfo errorObject={errorFlowRun} />
	if (errorFlowVersion) return <ErrorInfo errorObject={errorFlowVersion} />
	if (!flowRun) return <P>Can not find flow run details</P>
	if (!flowVersion) return <P>Can not find flow version details</P>
	if (connectorsMetadata.some((result) => result.isError)) return <ErrorInfo message="Can not fetch connectors details" />

	return (
		<ResizablePanelGroup direction="vertical" className="max-h-screen pt-2">
			<ResizablePanel defaultSize={30}>
				<div>
					{steps.map((stepData, index) => (
						<StepItem {...stepData} stepIndex={index} key={stepData.step.name} onSelectStep={onSelectStep} />
					))}
				</div>
			</ResizablePanel>
			{selectedResult && (
				<>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={35} minSize={5} maxSize={80} onResize={(size) => setResultInputPanelHeight(size)} className="p-1">
						<CodeEditor value={prepareCodeMirrorValue(selectedResult.input)} heightVh={resultInputPanelHeight} substractPx={40} title="Input" />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={35} minSize={5} maxSize={80} onResize={(size) => setResultOutputPanelHeight(size)} className="p-1">
						<CodeEditor value={prepareCodeMirrorValue(selectedResult.output)} heightVh={resultOutputPanelHeight} substractPx={100} title="Output" />
					</ResizablePanel>
				</>
			)}
		</ResizablePanelGroup>
	)
}
