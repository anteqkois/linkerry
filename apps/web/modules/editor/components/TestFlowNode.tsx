import { useToast } from '@linkerry/ui-components/client'
import { Card, H5 } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, useCallback, useMemo } from 'react'
import { nodeConfigs } from '../common/nodeFactory'
import { useEditor } from '../useEditor'

const testFlowVariants = cva('flex-center border-2 rounded-3xl', {
	variants: {
		valid: {
			true: 'text-primary bg-primary/20 border-primary/50 cursor-pointer',
			false: 'text-warning bg-warning-foreground border-warning/50 border-dashed cursor-not-allowed',
		},
	},
})

interface TestFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof testFlowVariants> {}

export const TestFlowNodeElement = ({ onClick, className }: TestFlowProps) => {
	const { flow, testingFlowVersion, flowOperationRunning, testFlowVersion } = useEditor()
	const { toast } = useToast()
	const flowValidity = useMemo(() => {
		if (flowOperationRunning) return { invalid: true, message: 'Operation runs...' }
		else if (!flow.version.valid) return { invalid: true, message: 'Complete Flow' }
		else if (testingFlowVersion) return { invalid: true, message: 'Testing...' }

		return { invalid: false }
	}, [flow.version.valid, testingFlowVersion, flowOperationRunning])

	const handleTestFlowVersion = useCallback(async () => {
		try {
			const flowRun = await testFlowVersion()
			toast({
				title: 'Test Flow Success',
				description: `Your test flow for ${flowRun.flowDisplayName} ran successfully`,
				variant: 'success',
			})
		} catch (error: any) {
			if (typeof error === 'string')
				toast({
					title: 'Test Flow Error',
					description: error,
					variant: 'destructive',
				})
			else {
				console.log(error)
				toast({
					title: 'Test Flow Error',
					description: 'Unknwon error occurred',
					variant: 'destructive',
				})
			}
		}
	}, [])

	return (
		<Card
			className={cn(testFlowVariants({ valid: !flowValidity.invalid }), ``, className)}
			style={{
				width: `${nodeConfigs.TestFlowNode.width}px`,
				height: `${nodeConfigs.TestFlowNode.height}px`,
			}}
			onClick={onClick}
		>
			<H5 onClick={handleTestFlowVersion}>{flowValidity.invalid ? flowValidity.message : 'Test Flow'}</H5>
		</Card>
	)
}
