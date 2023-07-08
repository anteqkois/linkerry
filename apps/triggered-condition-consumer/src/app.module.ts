import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConditionModule } from './modules/condition/condition.module';

@Module({
  imports: [ConditionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
