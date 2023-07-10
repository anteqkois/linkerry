import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertService {

  createAlert(createAlertDto: CreateAlertDto) {

  }

  generateLink() {
    // console.log(createAlertLinkDto);

    // generate salt

    // get condition from db

    // hash data to create hashed key

  }
}
