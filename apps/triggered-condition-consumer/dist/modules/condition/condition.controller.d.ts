import { ConditionService } from './condition.service';
import { CreateConditionDto } from './dto/create-condition.dto';
export declare class ConditionController {
    private readonly conditionService;
    constructor(conditionService: ConditionService);
    create(createConditionDto: CreateConditionDto): string;
}
//# sourceMappingURL=condition.controller.d.ts.map