import fastDeepEqual from 'fast-deep-equal'
import { common, getScopeAndKey } from './common'
import { Property, Validators, createAction } from '@linkerry/connectors-framework'

export const storageAddtoList = createAction({
  name: 'add_to_list',
  displayName: 'Add To List',
  description: 'Add Item to a list',
  errorHandlingOptions: {
    continueOnFailure: {
      hide: true,
    },
    retryOnFailure: {
      hide: true,
    },
  },
  props: {
    key: Property.ShortText({
      displayName: 'Key',
      required: true,
      validators: [Validators.maxLength(128)],
    }),
    value: Property.ShortText({
      displayName: 'Value',
      required: true,
    }),
    ignore_if_exists: Property.Checkbox({
      displayName: 'Ignore if value exists',
      required: false,
    }),
    store_scope: common.store_scope,
  },
  async run(context) {
    const { key, scope } = getScopeAndKey({
      runId: context.run.id,
      key: context.propsValue['key'],
      scope: context.propsValue.store_scope,
    })
    let items = (await context.store.get<unknown[]>(key, scope)) ?? []
    try {
      if (typeof items === 'string') {
        items = JSON.parse(items)
      }
      if (!Array.isArray(items)) {
        throw new Error(`Key ${context.propsValue['key']} is not an array`)
      }
    } catch (err) {
      throw new Error(`Key ${context.propsValue['key']} is not an array`)
    }
    if (context.propsValue['ignore_if_exists']) {
      for (const item of items) {
        if (fastDeepEqual(item, context.propsValue['value'])) {
          return items
        }
      }
    }
    items.push(context.propsValue['value'])
    return context.store.put(key, items, scope)
  },
})
