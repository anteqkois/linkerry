export function formatErrorMessage(errorMessage: string, tokens: Record<string, any>): string {
	let formattedMessage = errorMessage
	for (const key in tokens) {
		formattedMessage = formattedMessage.replace(`{${key}}`, tokens[key])
	}
	return formattedMessage
}

export const isEmpty = (value: unknown) => {
	if (typeof value === 'undefined' || value === null) return true
	return false
}

export const isNull = (value: unknown) => {
	return value == null
}

export const isInteger = (value: unknown) => {
	return typeof value == 'number' && value == toInteger(value)
}

export const toInteger = (value: unknown) => {
	const result = toFinite(value),
		remainder = result % 1

	return result === result ? (remainder ? result - remainder : result) : 0
}

export const toFinite = (value: unknown): number=> {
  if (!value) return 0
  return Number(value);
}
