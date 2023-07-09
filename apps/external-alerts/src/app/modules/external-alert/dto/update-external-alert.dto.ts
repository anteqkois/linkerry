import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalAlertTradinViewDto } from './create-external-alert-trading-view.dto';

export class UpdateExternalAlertDto extends PartialType(CreateExternalAlertTradinViewDto) {}
