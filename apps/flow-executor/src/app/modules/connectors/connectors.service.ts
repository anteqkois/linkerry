import { coingecko } from '@linkerry/coingecko'
import { Connector } from '@linkerry/connectors-framework'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class ConnectorsService {
  connectors = {
    coingecko: coingecko,
  }

  getConnector(name: string): Connector {
    const connector = this.connectors[name]
    if (!connector) throw new RpcException('Connector not found')
    return connector
  }

  getMetadata(name: string) {
    return this.getConnector(name).metadata()
  }
}
