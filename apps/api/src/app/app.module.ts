import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AlertModule } from './modules/alert/alert.module';
import { MongodbModule } from './common/mongodb';
import { CondictionModule } from './modules/condiction/condiction.module';

@Module({
  imports: [AlertModule, MongodbModule, CondictionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
