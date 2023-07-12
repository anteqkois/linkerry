import axios from 'axios';

describe('GET /api', () => {
  it('healtCheck', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(new Date(res.data).getDay()).toEqual(new Date().getDay());
  });
});
