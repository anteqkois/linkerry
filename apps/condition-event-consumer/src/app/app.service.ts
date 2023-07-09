import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDate(): Date {
    return new Date();
  }
}
