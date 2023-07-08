import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { CreateConditionDto } from './dto/create-condition.dto';
export declare class ConditionConsumer {
    private readonly client;
    private configService;
    private topic;
    constructor(client: ClientKafka, configService: ConfigService);
    processTriggered(createConditionDto: CreateConditionDto): string;
}
//# sourceMappingURL=condition.consumer.d.ts.map