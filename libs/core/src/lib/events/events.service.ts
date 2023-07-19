import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto'

@Injectable()
export class EventsService {
  generateEventId() {
    return randomUUID({ disableEntropyCache: false })
  }
}
