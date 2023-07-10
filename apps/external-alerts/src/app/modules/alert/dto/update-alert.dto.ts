import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertTradinViewDto } from './create-alert-trading-view.dto';

export class UpdateAlertDto extends PartialType(CreateAlertTradinViewDto) {}
