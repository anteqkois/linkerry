import { ExternalAlertService } from './external-alert.service';
import { CreateExternalAlertDto } from './dto/create-external-alert.dto';
export declare class ExternalAlertController {
    private readonly externalAlertService;
    constructor(externalAlertService: ExternalAlertService);
    create(createExternalAlertDto: CreateExternalAlertDto): Promise<string>;
}
//# sourceMappingURL=external-alert.controller.d.ts.map