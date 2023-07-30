import {
  AlertProviderType,
  EventObjectType,
  EventTypeType,
  IEventCondition
} from '@market-connector/types'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventsService } from '../../../events/events.service'
import { ConditionAlertDto } from '../../dto/create-condition.dto'
import { AlertProviderGateway } from '../../gateways'
import { TriggerAlertTradingViewDto } from './dto/trigger-trading-view.dto'

@Injectable()
export class TradingViewGateway implements AlertProviderGateway {
  constructor(private readonly configService: ConfigService, private readonly eventsService: EventsService) {}

  messagePattern({ conditionId }: { conditionId: string }) {
    return `{"conditionId": "${conditionId}", "ticker": "{{ticker}}", "close": "{{close}}"}`
  }

  createAlert(dto: ConditionAlertDto & { conditionId: string }) {
    if (!dto.conditionId) throw new UnprocessableEntityException(`Missing condition Id: ${dto.conditionId}`)
    const message = this.messagePattern({ conditionId: dto.conditionId })

    const alertHandlerUrl = `${this.configService.get('ALERT_HANDLER_URL')}/${dto.conditionId}`

    return { provider: AlertProviderType.TRADING_VIEW, messagePattern: message, handlerUrl: alertHandlerUrl }
  }

  conditionTriggeredEventFactory(dto: TriggerAlertTradingViewDto) {
    const event: IEventCondition = {
      id: this.eventsService.generateEventId(),
      createdUnix: new Date().getTime(),
      data: {
        id: dto.conditionId,
        object: EventObjectType.CONDITION,
        value: 1,
      },
      type: EventTypeType.CONDITION_TRIGGERED,
    }

    return event
  }
}
