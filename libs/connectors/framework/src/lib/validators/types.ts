import { ConnectorProperty } from '../property';

export type ValidationErrors = Record<
  string,
  string[] | Record<string, string[]>
>;

export type ValidatorFn = (
  property: ConnectorProperty,
  processedValue: any,
  userInput: any
) => string | null;

export enum ValidationInputType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  // FILE = 'FILE',
  ANY = 'ANY',
  DATE_TIME = 'DATE_TIME',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
  JSON = 'JSON',
}

export type TypedValidatorFn<T extends ValidationInputType = ValidationInputType> = {
  type: T;
  fn: ValidatorFn;
	validatorName?: string
	args?: string[]
};
