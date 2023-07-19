import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { Model } from 'mongoose';
import { Condition, ConditionDocument, ConditionOperatorType, ConditionTypeType } from '../conditions';
import { MessageProvider } from './message.provider';
import { ConfigService } from '@nestjs/config';
import { AlertProviderUrlPart } from './types';

@Injectable()
export class AlertsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly messageProvider: MessageProvider,
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
    @InjectModel(Condition.name) private readonly conditionModel: Model<ConditionDocument>,
  ) { }

  async createAlert(createAlertDto: CreateAlertDto, userId: string) {
    // Evry alert is also a condition.
    const condition = await this.conditionModel.create({
      userId: userId,
      name: createAlertDto.name,
      type: ConditionTypeType.ALERT,
      requiredValue: 1,
      operator: ConditionOperatorType.EQUAL,
      active: createAlertDto.active,
      eventValidityUnix: createAlertDto.alertValidityUnix,
      ticker: createAlertDto.ticker,
      testMode: createAlertDto.testMode
    })

    const alertHandlerUrl = this.configService.get('ALERT_HANDLER_URL')
    const urlProviderPart = AlertProviderUrlPart[createAlertDto.alertProvider]
    if (!urlProviderPart) throw new UnprocessableEntityException(`Can not find url part for given alert provider: ${ createAlertDto.alertProvider }`)

    const alert = await this.alertModel.create({
      userId: userId,
      conditionId: condition.id,
      name: createAlertDto.name,
      active: createAlertDto.active,
      alertValidityUnix: createAlertDto.alertValidityUnix,
      alertProvider: createAlertDto.alertProvider,
      ticker: createAlertDto.ticker,
      testMode: createAlertDto.testMode,
      requiredValue: 1,
      alertHandlerUrl: `${ alertHandlerUrl }/${ urlProviderPart }`,
    })

    alert.messagePattern = this.messageProvider.getTemplate({ alertId: alert.id, alertProvider: createAlertDto.alertProvider })
    if (!alert.messagePattern) throw new UnprocessableEntityException(`Can not find message pattern for given alert provider: ${ createAlertDto.alertProvider }`)

    alert.alertHandlerUrl = `${ alert.alertHandlerUrl }/${ alert.id }`

    await alert.save()
    return { condition: condition.toObject(), alert: alert.toObject() }
  }
}
