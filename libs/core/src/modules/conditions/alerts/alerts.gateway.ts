import { AlertProviderType, ConditionOperatorType, ConditionTypeType, ICondition } from '@market-connector/types'
import { Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateConditionAlertDto } from '../dto/create-condition.dto'
import { AlertProviderGateway, ConditionTypeGateway } from '../gateways'
import { ConditionAlert } from './alerts.schema'
import { TradingViewGateway } from './trading-view/trading-view.gateway'

export class AlertGateway implements ConditionTypeGateway {
  private readonly logger = new Logger(AlertGateway.name)
  private alertProviderGateways: Record<string, AlertProviderGateway> = {}

  public registerAlertProvidertGateway(alertProvider: AlertProviderType, gateway: AlertProviderGateway) {
    this.alertProviderGateways[alertProvider] = gateway
  }

  constructor(
    private readonly tradingViewGateway: TradingViewGateway,
    @InjectModel(ConditionAlert.name) private readonly conditionAlertModel: Model<ConditionAlert>,
  ) {
    this.registerAlertProvidertGateway(AlertProviderType.TRADING_VIEW, tradingViewGateway)
  }

  async createCondition(dto: CreateConditionAlertDto, userId: string): Promise<ICondition> {
    const condition = await this.conditionAlertModel.create({
      user: userId,
      name: dto.name,
      type: ConditionTypeType.ALERT,
      requiredValue: 1,
      operator: dto.operator ?? ConditionOperatorType.EQUAL,
      active: dto.active,
      eventValidityUnix: dto.eventValidityUnix,
      testMode: dto.testMode,
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
}
