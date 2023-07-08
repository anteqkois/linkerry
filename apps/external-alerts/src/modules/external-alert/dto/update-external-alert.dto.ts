import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalAlertDto } from './create-external-alert-trading-view.dto';

export class UpdateExternalAlertDto extends PartialType(CreateExternalAlertDto) {}
