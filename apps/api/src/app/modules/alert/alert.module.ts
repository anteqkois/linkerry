import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';

@Module({
  controllers: [AlertController],
  providers: [AlertService]
})
export class AlertModule {}
