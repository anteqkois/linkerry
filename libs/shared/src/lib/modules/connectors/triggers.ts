import { StepName, TriggerEmpty, TriggerType } from '../flows'

export const generateEmptyTrigger = (name: StepName): TriggerEmpty => {
	return {
		name,
		displayName: 'Select trigger',
		type: TriggerType.Empty,
		valid: false,
	}
}
