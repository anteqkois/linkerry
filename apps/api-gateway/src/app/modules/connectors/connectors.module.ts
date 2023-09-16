import { NEXT_TOKENS } from '@market-connector/shared'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConnectorsController } from './connectors.controller'
import { ConnectorsService } from './connectors.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NEXT_TOKENS.FLOW_EXECUTOR,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3005,
        },
      },
    ]),
  ],
  controllers: [ConnectorsController],
  providers: [ConnectorsService],
})
export class ConnectorsModule {}
