import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule, ConditionsModule, CoreModule, UsersModule } from '@market-connector/core';

@Module({
  imports: [CoreModule, ConditionsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
