import { Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition, ConditionDocument, ConditionEvent, ConditionTypeType } from '../../conditions';
import { AlertProvidersType, AlertsGateway } from '../models';
import { CreateAlertTradinViewDto } from './dto/create-alert-trading-view.dto';
import { AlertTradinView, AlertTradinViewDocument } from './trading-view.schema';
import { ProcessAlertTradinViewDto } from './dto/process-alert-trading-view.dto';
import { EventsService } from '../../events/events.service';
import { EventObjectType, TOKENS, TOPIC } from '../../events';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TradingViewGateway implements AlertsGateway {
  private readonly logger = new Logger(TradingViewGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
    @InjectModel(AlertTradinView.name) private readonly alertModel: Model<AlertTradinViewDocument>,
    @Inject(TOKENS.CONDITION) private readonly clientKafka: ClientKafka
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

  conditionTriggeredEventEmiter(dto: ProcessAlertTradinViewDto) {
    const event: ConditionEvent = {
      event_id: this.eventsService.generateEventId(),
      object: EventObjectType.CONDITION,
      data: {
        type: ConditionTypeType.ALERT,
        value: "1",
      }
    }

    this.clientKafka.emit(TOPIC.CONDITION_TRIGGERED, JSON.stringify(event))
    this.logger.verbose('New event created')
  }
}
