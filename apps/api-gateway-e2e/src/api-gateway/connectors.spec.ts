import { ConnectorMetadata } from '@linkerry/connectors-framework'
import axios from 'axios'
import { valid } from 'semver'

const coingecko = {
  displayName: 'Coingecko',
  name: '@linkerry/coingecko',
  description: 'Coingecko connector for cryptocurrency data',
  logoUrl: '',
  triggers: 1,
  auth: null,
  minimumSupportedRelease: '0.0.0',
  maximumSupportedRelease: '9999.9999.9999',
  version: '0.0.1',
  actions: 2,
}

describe('GET /api/connectors', () => {
  it('should return a connector metadata', async () => {
    const { data, status } = await axios.get<ConnectorMetadata[]>(`/connectors`)

    expect(status).toBe(200)
    expect(data.length).toBeGreaterThan(0)

    const firstConnector = data[0]
    expect(firstConnector.actions).toBeGreaterThanOrEqual(0)
    expect(firstConnector.triggers).toBeGreaterThanOrEqual(0)
    expect(firstConnector.displayName.length).toBeGreaterThan(0)
    expect(firstConnector.name.length).toBeGreaterThan(0)
    expect(firstConnector.description.length).toBeGreaterThan(0)
    expect(valid(firstConnector.minimumSupportedRelease)).toBeTruthy()
    expect(valid(firstConnector.maximumSupportedRelease)).toBeTruthy()
  })

  it('should return coingecko connector metadata after filtration', async () => {
    const { data } = await axios.get<ConnectorMetadata[]>(`/connectors`, {
      params: {
        displayName: 'coingecko',
      },
    })

    const metadata = data[0]
    expect(metadata.actions).toBeGreaterThanOrEqual(0)
    expect(metadata.auth).toBe(coingecko.auth)
    expect(metadata.description).toBe(coingecko.description)
    expect(metadata.displayName).toBe(coingecko.displayName)
    expect(metadata.logoUrl).toBeDefined()
    expect(metadata.maximumSupportedRelease).toBe(coingecko.maximumSupportedRelease)
    expect(metadata.minimumSupportedRelease).toBe(coingecko.minimumSupportedRelease)
    expect(metadata.name).toBe(coingecko.name)
    expect(metadata.triggers).toBeGreaterThanOrEqual(0)
    expect(metadata.version).toBe(coingecko.version)
  })

  it('should return empty array for filtration when no results', async () => {
    const { data } = await axios.get<ConnectorMetadata[]>(`/connectors`, {
      params: {
        displayName: 'unknown connecotr',
      },
    })

    expect(data.length).toEqual(0)
  })
})
