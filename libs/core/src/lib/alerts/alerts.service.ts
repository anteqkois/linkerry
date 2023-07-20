import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition, ConditionDocument, ConditionOperatorType, ConditionTypeType } from '../conditions';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertProvidersType, AlertsGateway } from './models';

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
    @InjectModel(Condition.name) private readonly conditionModel: Model<ConditionDocument>,
  ) { }

  async createAlert(createAlertDto: CreateAlertDto, userId: string) {
    const alertGateway = this.alertProviderGateways[createAlertDto.alertProvider]
    if(!alertGateway) throw new UnprocessableEntityException(`No gateway for given alert provider: ${ createAlertDto.alertProvider }`)

    // Evry alert have also their condition.
    const condition = await this.conditionModel.create({
      userId: userId,
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
