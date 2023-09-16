import { PartialType } from '@nestjs/mapped-types';
import { CreateConnectorDto } from './create-connector.dto';

export class UpdateConnectorDto extends PartialType(CreateConnectorDto) {}
