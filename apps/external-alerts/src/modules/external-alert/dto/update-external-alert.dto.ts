import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalAlertDto } from './create-external-alert.dto';

export class UpdateExternalAlertDto extends PartialType(CreateExternalAlertDto) {}
