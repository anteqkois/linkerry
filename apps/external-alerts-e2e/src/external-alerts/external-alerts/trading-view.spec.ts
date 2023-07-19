import axios from 'axios';
import { TradinViewDto } from '@market-connector/core'
import { alwaysExistingAlert } from '@market-connector/tools'

describe('POST /trading-view', () => {
  it('should reject proccess alert when invalid data', async () => {
    const res = axios.post(`/trading-view`, {
      ticker: 'ETHUSDT'
    });

    await expect(res).rejects.toHaveProperty("response.status", 422)
  });

  it('should proccess alert when valid data', async () => {
    const input: TradinViewDto = {
      alertId: alwaysExistingAlert._id,
      close: '1920',
      ticker: 'ETHUSDT'
    }

    const res = await axios.post(`/trading-view`, input);

    expect(res.status).toBe(201)
  });
});
