import { tags } from 'typia'

export type ShortStringType<T extends number = 255> = string & tags.MaxLength<T>
export type DateType = string & tags.Format<'date'>
export type ConnectorNameType = string & tags.Pattern<'^@linkerry/.*'> & tags.MaxLength<255>

// eslint-disable-next-line no-useless-escape
export type VersionType = string & tags.Pattern<'^([~^])?[0-9]+\.[0-9]+\.[0-9]+$'> // ^([~^])?[0-9]+\.[0-9]+\.[0-9]+$
// eslint-disable-next-line no-useless-escape
export type StepNameType = string & tags.Pattern<'^([a-zA-Z]+)_(\d+)$'> // ^([a-zA-Z]+)_(\d+)$
