import axios from 'axios';
import { ConditionTypeType, EventObjectType} from '@market-connector/core'

describe('POST /external-alerts', () => {
  it('should process alert', async () => {
    const input = {
      alertId: 'randomAlertId'
    }

    const res = await axios.post(`/api/external-alerts`, input);
    expect(res.status).toBe(201);
    expect(res.data.message).toEqual('Event created');
    expect(res.data.data).toMatchObject({
      event_id: expect.any(String),
      object: EventObjectType.CONDITION,
      data: {
        type: ConditionTypeType.ALERT,
        value: "1",
      }
    });
  });
});
