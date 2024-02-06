import { Id, TimestampDatabase } from '../../../common'

export interface TriggerEvent extends TimestampDatabase {
	_id: Id
	flowId: Id
	// projectId: 'JWSAC8EcgTnFEYY8hy4zW'
	sourceName: string	//'@activepieces/piece-google-sheets@~0.7.4:new_row'
	payload: any
}
