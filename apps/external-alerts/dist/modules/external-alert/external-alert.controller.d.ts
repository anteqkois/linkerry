import { CreateExternalAlertDto } from './dto/create-external-alert-trading-view.dto';
import { ExternalAlertService } from './external-alert.service';
export declare class ExternalAlertController {
    private readonly externalAlertService;
    constructor(externalAlertService: ExternalAlertService);
    create(createExternalAlertDto: CreateExternalAlertDto): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=external-alert.controller.d.ts.map