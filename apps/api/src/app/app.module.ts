import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AlertModule } from './modules/alert/alert.module';
import { MongodbModule } from './common/mongodb';

@Module({
  imports: [AlertModule, MongodbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
