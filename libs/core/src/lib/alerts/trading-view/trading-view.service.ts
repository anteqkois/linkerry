import {  Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition, ConditionDocument } from '../../conditions';
import {  AlertProvidersType, AlertsGateway } from '../models';
import { CreateAlertTradinViewDto } from './dto/create-alert-trading-view.dto';
import { AlertTradinView, AlertTradinViewDocument } from './trading-view.schema';

@Injectable()
export class TradingViewService implements AlertsGateway {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(AlertTradinView.name) private readonly alertModel: Model<AlertTradinViewDocument>,
    @InjectModel(Condition.name) private readonly conditionModel: Model<ConditionDocument>,
  ) { }

  messagePattern({ alertId }: { alertId: string }) {
    return `{"alertId": "${ alertId }", "ticker": "{{ticker}}", "close": "{{close}}"}`
  }

  async cresteAlert(dto: CreateAlertTradinViewDto, conditionId: string, userId: string) {

    const alertHandlerUrl = this.configService.get('ALERT_HANDLER_URL')
    const alert = await this.alertModel.create({
      userId: userId,
      conditionId,
      name: dto.name,
      active: dto.active,
      alertValidityUnix: dto.alertValidityUnix,
      alertProvider: AlertProvidersType.TRADING_VIEW,
      symbol: dto.symbol,
      testMode: dto.testMode,
      requiredValue: 1,
      alertHandlerUrl: `${ alertHandlerUrl }/trading-view`,
    })

    alert.messagePattern = this.messagePattern({ alertId: alert.id })
    if (!alert.messagePattern) throw new UnprocessableEntityException(`Can not find message pattern for given alert provider: ${ AlertProvidersType.TRADING_VIEW }`)

    alert.alertHandlerUrl = `${ alert.alertHandlerUrl }/${ alert.id }`
    await alert.save()
    return alert
  }
}
