import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsModule, AllExceptionsFilter, AuthModule, CondictionsModule, CoreModule, UsersModule } from '@market-connector/core';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [CondictionsModule, UsersModule, AlertsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // To register as a global guard
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule { }
