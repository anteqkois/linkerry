import { Injectable, Logger } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { Model } from 'mongoose';
import { Condition, ConditionDocument, ConditionOperatorType, ConditionTypeType } from '../conditions';
import { User } from '../users';

@Injectable()
export class AlertsService {
  // private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
    @InjectModel(Condition.name) private conditionModel: Model<ConditionDocument>,
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
    })
    return {condition, alert}
  }

  generateLink() {
    // console.log(createAlertLinkDto);

    // generate salt

    // get condition from db

    // hash data to create hashed key

  }
}
