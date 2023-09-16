import { Injectable } from '@nestjs/common'
import { coingecko } from '@market-connector/connectors/coingecko'
import { Connector } from '@market-connector/connectors-framework'

@Injectable()
export class ConnectorsService {
  connectors = {
    coingecko: coingecko,
  }

  getConnector(name: string): Connector {
    return this.connectors[name]
  }

  getMetadata(name: string) {
    return this.getConnector(name).metadata()
  }
}
