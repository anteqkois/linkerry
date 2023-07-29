import { AlertProviderType } from '@market-connector/types'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateAlertDto } from '../../dto/create-condition.dto'
import { AlertProviderGateway } from '../../gateways'

@Injectable()
export class TradingViewGateway implements AlertProviderGateway {
  private readonly logger = new Logger(TradingViewGateway.name)

  constructor(
    private readonly configService: ConfigService, // @InjectModel(AlertTradinView.name) private readonly alertModel: Model<AlertTradinViewDocument>, // private readonly eventsService: EventsService,
  ) // @Inject(TOKENS.CONDITION) private readonly clientKafka: ClientKafka,
  {}

  messagePattern({ conditionId }: { conditionId: string }) {
    return `{"conditionId": "${conditionId}", "ticker": "{{ticker}}", "close": "{{close}}"}`
  }

  createAlert(dto: CreateAlertDto & { conditionId: string }) {
    if (!dto.conditionId) throw new UnprocessableEntityException(`Missing condition Id: ${dto.conditionId}`)
    const message = this.messagePattern({ conditionId: dto.conditionId })

    const alertHandlerUrl = `${this.configService.get('ALERT_HANDLER_URL')}/${dto.conditionId}`

    return { provider: AlertProviderType.TRADING_VIEW, messagePattern: message, handlerUrl: alertHandlerUrl }
  }

  // conditionTriggeredEventEmiter(dto: ProcessAlertTradinViewDto) {
  conditionTriggeredEventEmiter(dto: any) {
    // const event: IConditionEvent = {
    //   event_id: this.eventsService.generateEventId(),
    //   object: EventObjectType.CONDITION,
    //   data: {
    //     type: ConditionTypeType.ALERT,
    //     value: '1',
    //   },
    // }
    // this.clientKafka.emit(TOPIC.CONDITION_TRIGGERED, JSON.stringify(event))
    // this.logger.verbose('New event created')
  }
}
