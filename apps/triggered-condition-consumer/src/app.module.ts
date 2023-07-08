import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConditionModule } from './modules/condition/condition.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConditionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
