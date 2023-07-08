import { CreateExternalAlertDto } from './dto/create-external-alert.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
export declare class ExternalAlertService {
    private readonly client;
    private configService;
    private topic;
    constructor(client: ClientKafka, configService: ConfigService);
    processAlert(createExternalAlertDto: CreateExternalAlertDto): Promise<string>;
}
//# sourceMappingURL=external-alert.service.d.ts.map