import merge from 'lodash.merge'
import { DeepPartial } from '../types-and-resolvers'
import { clone } from './clone'

// export const deepMerge = <T extends Record<string, any>>(target: T, updates: DeepPartial<T>): T => {
export const deepMerge = <T>(target: T, updates: DeepPartial<T>): T => {
  const targetCopy = clone(target)
  return merge(targetCopy, updates) as T
}
