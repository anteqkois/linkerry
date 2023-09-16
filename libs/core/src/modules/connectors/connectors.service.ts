import { Injectable } from '@nestjs/common';
import { CreateConnectorDto } from './dto/create-connector.dto';
import { UpdateConnectorDto } from './dto/update-connector.dto';

@Injectable()
export class ConnectorsService {
  getMetadata(name: string) {
    // 
  }
}
