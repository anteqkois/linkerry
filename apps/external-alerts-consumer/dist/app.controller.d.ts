import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ObservableInput } from 'rxjs';
export declare class AppController {
    private readonly appService;
    private configService;
    private readonly client;
    private topic;
    constructor(appService: AppService, configService: ConfigService, client: ClientKafka);
    getHello(): string;
    testKafka(): ObservableInput<any>;
}
//# sourceMappingURL=app.controller.d.ts.map