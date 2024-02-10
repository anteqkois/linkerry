export const retriveStepInputFromObject = (
	currentInputState: Record<string, any>,
	newValues: any,
	options: {
		onlyChanged: boolean
	},
) => {
	const data: Record<string, any> = {}

	for (const [key, value] of Object.entries(newValues)) {
		if (key === 'triggerName' || key === 'actionName' || key.includes('__temp__')) continue
		if (options.onlyChanged && currentInputState[key] == value) continue
		data[key] = value
	}

	return data
}
