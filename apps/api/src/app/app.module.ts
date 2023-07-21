import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsModule, AuthModule, CondictionsModule, CoreModule, UsersModule } from '@market-connector/core';

@Module({
  imports: [CoreModule, CondictionsModule, UsersModule, AlertsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
