export const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data))
// export const clone = <T>(data: T): T => Object.assign({}, data)
