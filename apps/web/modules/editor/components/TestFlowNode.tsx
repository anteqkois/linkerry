import { Card, H5 } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, useMemo } from 'react'
import { nodeConfigs } from '../common/nodeFactory'
import { useEditor } from '../useEditor'

const testFlowVariants = cva('flex-center border-2 rounded-3xl', {
	variants: {
		valid: {
			true: 'text-primary bg-primary/20 border-primary/50 cursor-pointer',
			false: 'text-orange-200 bg-orange-500/20 border-orange-500/50 border-dashed cursor-not-allowed',
		},
	},
})

interface TestFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof testFlowVariants> {}

export const TestFlowNodeElement = ({ onClick, className }: TestFlowProps) => {
	const { flow, testingFlowVersion, testFlowVersion } = useEditor()
	const flowValidity = useMemo(() => {
		if (!flow.version.valid) return { invalid: true, message: 'Complete Flow' }
		if (testingFlowVersion) return { invalid: true, message: 'Testing...' }

		return { invalid: false }
	}, [flow.version.valid, testingFlowVersion])

	return (
		<Card
			className={cn(testFlowVariants({ valid: !flowValidity.invalid }), ``, className)}
			style={{
				width: `${nodeConfigs.TestFlowNode.width}px`,
				height: `${nodeConfigs.TestFlowNode.height}px`,
			}}
			onClick={onClick}
		>
			<H5 onClick={testFlowVersion}>{flowValidity.invalid ? flowValidity.message : 'Test Flow'}</H5>
		</Card>
	)
}
