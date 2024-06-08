import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { addition } from './actions/addition'
import { division } from './actions/division'
import { generateRandom } from './actions/generateRandom'
import { modulo } from './actions/modulo'
import { multiplication } from './actions/multiplication'
import { subtraction } from './actions/subtraction'


export const math = createConnector({
  displayName: 'Math Helper',
  description: 'Perform mathematical operations on a data.',
  descriptionLong: 'Perform mathematical operations on data. For example, if the input data you want to use is in a different annotation format (e.g., $14 as 1400), you can divide it and create a new annotation number to fit your other input.',
  auth: ConnectorAuth.None(),
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/math-helper.png',
  tags: ['data management', 'core'],
  actions: [addition, subtraction, multiplication, division, modulo, generateRandom],
  triggers: [],
})
