import axios from 'axios'

describe('GET /api/connectors', () => {
  it('should return a connector metadata', async () => {
    const res = await axios.get(`/connectors/metadata/test`)

    console.dir(res.data, { depth: null })

    expect(res.status).toBe(200)
    expect(res.data).toBeDefined()
    // expect(res.data).toEqual({ message: 'Hello API' })
  })
})
