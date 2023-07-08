import { KafkaContext } from '@nestjs/microservices';
import { ConditionConsumer } from './condition.consumer';
export declare class ConditionController {
    private readonly conditionService;
    constructor(conditionService: ConditionConsumer);
    readMessage(message: any, context: KafkaContext): string;
}
//# sourceMappingURL=condition.controller.d.ts.map