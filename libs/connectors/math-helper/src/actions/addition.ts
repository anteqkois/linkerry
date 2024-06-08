import { ConnectorAuth, Property, createAction } from '@linkerry/connectors-framework'

export const addition = createAction({
  name: 'addition_math',
  auth: ConnectorAuth.None(),
  displayName: 'Addition',
  description: 'Add the first number and the second number',
  descriptionLong: 'Add the first number and the second number',
  errorHandlingOptions: {
    continueOnFailure: {
      hide: true,
    },
    retryOnFailure: {
      hide: true,
    },
  },
  props: {
    first_number: Property.Number({
      displayName: 'First Number',
      description: undefined,
      required: true,
    }),
    second_number: Property.Number({
      displayName: 'Second Number',
      description: undefined,
      required: true,
    }),
  },
  async run(context) {
    return context.propsValue['first_number'] + context.propsValue['second_number']
  },
})
