import { Alert } from "./schemas/alert.schema";

export abstract class AlertsGateway {
  abstract cresteAlert(dto: any, conditionId: string, userId:string): Promise<Alert>;
  abstract messagePattern(options:{ alertId: string }): string;
  abstract conditionTriggeredEventEmiter(dto: any): void;
}
