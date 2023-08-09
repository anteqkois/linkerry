import { AlertProvider, ConditionOperator, ConditionType, ICondition } from '@market-connector/types'
import { Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, UpdateQuery } from 'mongoose'
import { EVENT_TOKENS, EVENT_TOPIC } from '../../events'
import { CreateAlertDto } from '../dto/create-condition.dto'
import { AlertProviderGateway, ConditionTypeGateway } from '../gateways'
import { Alert } from './alerts.schema'
import { TradingViewGateway } from './trading-view/trading-view.gateway'

@Injectable()
export class AlertGateway implements ConditionTypeGateway {
  private readonly logger = new Logger(AlertGateway.name)
  private alertProviderGateways: Record<string, AlertProviderGateway> = {}

  public registerAlertProvidertGateway(alertProvider: AlertProvider, gateway: AlertProviderGateway) {
    this.alertProviderGateways[alertProvider] = gateway
  }

  constructor(
    private readonly tradingViewGateway: TradingViewGateway,
    @InjectModel(Alert.name) private readonly conditionAlertModel: Model<Alert>,
    @Inject(EVENT_TOKENS.CONDITION) private readonly clientKafka: ClientKafka,
  ) {
    this.registerAlertProvidertGateway(AlertProvider.TradingView, tradingViewGateway)
  }

  async createCondition(dto: CreateAlertDto, userId: string): Promise<ICondition> {
    const condition = await this.conditionAlertModel.create({
      user: userId,
      name: dto.name,
      type: ConditionType.Alert,
      requiredValue: 1,
      operator: dto.operator ?? ConditionOperator.Equal,
      eventValidityUnix: dto.eventValidityUnix,
      isMarketProvider: dto.isMarketProvider,
      triggeredTimes: 0,
      alert: {},
    })

    const alertGateway = this.alertProviderGateways[dto.alert.provider]
    if (!alertGateway)
      throw new UnprocessableEntityException(`No alert gateway for given alert provider: ${dto.alert.provider}`)

    const alert = await alertGateway.createAlert({
      conditionId: condition.id,
      provider: dto.alert.provider,
    })

    if (!alert) throw new UnprocessableEntityException(`Alert not created, source data: ${dto.alert}`)

    condition.alert = alert
    await condition.save()

    return condition
  }

  async conditionTriggeredEmiter(dto: any, provider: AlertProvider) {
    const event = this.alertProviderGateways[provider].conditionTriggeredEventFactory(dto)

    this.clientKafka.emit(EVENT_TOPIC.CONDITION_TRIGGERED, JSON.stringify(event))

    await this.conditionAlertModel.findOneAndUpdate({ _id: event.data.id }, { $inc: { triggeredTimes: 1 } })
    this.logger.verbose(`Event emited: ${event.id}`)
  }

  async updateCondition(filter: FilterQuery<Alert>, data: UpdateQuery<Alert>['$set']): Promise<ICondition | null> {
    return await this.conditionAlertModel.findOneAndUpdate({ _id: filter._id }, data)
  }
}
