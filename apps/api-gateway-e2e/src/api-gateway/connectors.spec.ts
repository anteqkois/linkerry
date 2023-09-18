import axios from 'axios'

describe('GET /api/connectors', () => {
  it('should return a connector metadata', async () => {
    const res = await axios.get(`/connectors/coingecko/metadata`)

    expect(res.status).toBe(200)
    expect(res.data.name).toBe('coingecko')
  })

  it('should throw error when unknown connector', async () => {
    const res = axios.get(`/connectors/coingecko2/metadata`)

    expect(res).rejects.toHaveProperty('response.status', 500)
  })
})
