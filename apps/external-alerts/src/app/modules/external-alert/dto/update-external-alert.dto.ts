import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalAlertTradinViewDto } from './create-external-alert.dto';

export class UpdateExternalAlertDto extends PartialType(CreateExternalAlertTradinViewDto) {}
