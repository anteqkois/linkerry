import { DatabaseTimestampKeys, TriggerEvent } from '@linkerry/shared';
import { Schema } from 'mongoose';

// export type SaveTriggerEventInput = Omit<TriggerEvent, '_id' | 'sourceName' | 'createdAt' | 'updatedAt'> & { sourceName?: string }
export type SaveTriggerEventInput = Omit<TriggerEvent, '_id' | 'sourceName' | DatabaseTimestampKeys> & { sourceName?: string }

export interface InsertNewTrigerEventEvent {
	_id: Schema.Types.ObjectId;
	operationType: 'insert';
	// clusterTime: Timestamp { low: 1, high: 1709136550, unsigned: true },
	fullDocument: Omit<TriggerEvent, '_id'> & {
		_id: string;
	};
	// ns: { db: 'blog_scrapper', coll: 'postContent' },
	documentKey: {
		_id: string;
		// _id: Schema.Types.ObjectId;
	};
}
