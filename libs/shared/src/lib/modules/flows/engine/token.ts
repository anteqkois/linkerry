export const VARIABLE_TOKEN_REGEX = RegExp('\\{\\{(.*?)\\}\\}', 'g')
export const hasVariableToken = (value: string) => value.match(VARIABLE_TOKEN_REGEX)
