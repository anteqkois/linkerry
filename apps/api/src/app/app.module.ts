import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MongodbModule } from './common/mongodb';
import { CustomersModule, AlertsModule, CondictionsModule, AuthModule } from '@market-connector/core';

@Module({
  imports: [AlertsModule, CondictionsModule, CustomersModule, AlertsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    // To register as a global guard
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule { }
