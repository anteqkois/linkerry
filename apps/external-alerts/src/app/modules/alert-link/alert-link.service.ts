import { Injectable } from '@nestjs/common';
import { CreateAlertLinkDto } from './dto/create-alert-link.dto';

@Injectable()
export class AlertLinkService {

  generateLink(createAlertLinkDto: CreateAlertLinkDto){
    console.log(createAlertLinkDto);

    // generate salt

    // get condition from db

    // hash data to create hashed key

  }
}
