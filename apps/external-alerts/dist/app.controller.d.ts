import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { ObservableInput } from 'rxjs';
import { AppService } from '../src/app.service';
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