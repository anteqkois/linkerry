import { ShortStringType } from '../../../common/type-validators'
import { BaseStep, BaseStepSettings } from '../steps'
// import { baseStepSchema, baseStepSettingsSchema } from '../steps/base'

export enum TriggerType {
	EMPTY = 'EMPTY',
	CONNECTOR = 'CONNECTOR',
}

export enum TriggerStrategy {
	POLLING = 'POLLING',
	WEBHOOK = 'WEBHOOK',
	APP_WEBHOOK = 'APP_WEBHOOK',
}

/* BASE */
export interface BaseTrigger extends BaseStep {
	type: TriggerType
	settings: any // TODO
}

/* EMPTY */
export interface TriggerEmpty extends BaseStep {
	type: TriggerType.EMPTY
	settings?: any
}

export const isEmptyTrigger = (trigger: Trigger): trigger is TriggerEmpty => {
	return trigger.type === TriggerType.EMPTY
}

/* CONNECTOR */
export interface TriggerConnectorSettings extends BaseStepSettings {
	triggerName: ShortStringType // 'new_row'
}

export interface TriggerConnector extends BaseStep {
	type: TriggerType.CONNECTOR
	settings: TriggerConnectorSettings
}

export const isConnectorTrigger = (trigger: any): trigger is TriggerConnector => {
	return trigger?.type === TriggerType.CONNECTOR
}

/* TRIGGER */
export type Trigger = TriggerEmpty | TriggerConnector
export type TriggerNotEmpty = TriggerConnector

export function isTrigger(data: unknown): data is Trigger {
	if (data && typeof data === 'object' && 'name' in data && typeof data.name === 'string' && data.name.startsWith('trigger')) return true
	return false
}

export const generateEmptyTrigger = (name: string): TriggerEmpty => {
	return {
		name,
		displayName: 'Select trigger',
		type: TriggerType.EMPTY,
		valid: false,
		nextActionName: '',
	}
}

export const retriveStepNumber = (name: string): number => {
	const nameParts = name.split('_')
	return Number(nameParts[nameParts.length - 1])
}
