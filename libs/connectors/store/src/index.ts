import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { storageAddtoList } from './actions/store-add-to-list'
import { storageAppendAction } from './actions/store-append-action'
import { storageGetAction } from './actions/store-get-action'
import { storagePutAction } from './actions/store-put-action'
import { storageRemoveFromList } from './actions/store-remove-from-list'
import { storageRemoveValue } from './actions/store-remove-value'

export const storage = createConnector({
  displayName: 'Storage',
  description: 'Store or get data from key/value database',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/storage.png',
  tags: ['core', 'database'],
  auth: ConnectorAuth.None(),
  actions: [storageGetAction, storagePutAction, storageAppendAction, storageRemoveValue, storageAddtoList, storageRemoveFromList],
  triggers: [],
})
