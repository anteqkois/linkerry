import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { CreateExternalAlertDto } from './dto/create-external-alert-trading-view.dto';
export declare class ExternalAlertService {
    private readonly client;
    private configService;
    private topic;
    constructor(client: ClientKafka, configService: ConfigService);
    processAlert(createExternalAlertDto: CreateExternalAlertDto): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=external-alert.service.d.ts.map