import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition} from '../conditions';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertsGateway } from './models';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { AlertProvidersType, ConditionOperatorType, ConditionTypeType } from '@market-connector/types';

@Injectable()
export class AlertsService {
  private alertProviderGateways: Record<string, AlertsGateway> = {};

  public registerPaymentGateway(
    alertProvider: AlertProvidersType,
    gateway: AlertsGateway,
  ) {
    this.alertProviderGateways[alertProvider] = gateway;
  }

  constructor(
    @InjectModel(Condition.name) private readonly conditionModel: Model<Condition>,
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
  ) { }

  async createAlert(createAlertDto: CreateAlertDto, userId: string) {
    // Unique index not always work, so implement additional guard
    const existingAlert = await this.alertModel.findOne({name: createAlertDto.name, user: userId})
    if(existingAlert) throw new UnprocessableEntityException(`Alert with this data exists: ${ existingAlert.id }`)

    const alertGateway = this.alertProviderGateways[createAlertDto.alertProvider]
    if(!alertGateway) throw new UnprocessableEntityException(`No gateway for given alert provider: ${ createAlertDto.alertProvider }`)

    // Evry alert have also their condition.
    const condition = await this.conditionModel.create({
      user: userId,
      name: createAlertDto.name,
      type: ConditionTypeType.ALERT,
      requiredValue: 1,
      operator: ConditionOperatorType.EQUAL,
      active: createAlertDto.active,
      eventValidityUnix: createAlertDto.alertValidityUnix,
      symbol: createAlertDto.symbol,
      testMode: createAlertDto.testMode
    })

    const alert = await alertGateway.cresteAlert(createAlertDto, condition.id, userId)

    return { condition, alert }
  }











  async processAlert(){}
  // async handleTradinViewAlert(dto: ProcessAlertTradinViewDto) {
  //   console.log(dto);
  //   // const event: ConditionEvent = {
  //   //   event_id: this.eventsService.generateEventId(),
  //   //   object: EventObjectType.CONDITION,
  //   //   data: {
  //   //     type: ConditionTypeType.ALERT,
  //   //     value: "1",
  //   //   }
  //   // }

  //   // this.client.emit(this.topic, JSON.stringify(event))
  //   this.logger.verbose('New event created')
  // }
}
