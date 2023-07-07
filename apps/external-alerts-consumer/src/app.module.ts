import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONDITION-PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'external-alerts-consumer-0',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'condition',
          },
        },
      },
    ]),
    ConfigModule.forRoot({ envFilePath: '.env', })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
