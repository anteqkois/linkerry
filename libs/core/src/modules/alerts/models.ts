import { Alert } from "./schemas/alert.schema";

export enum AlertProvidersType {
  TRADING_VIEW = 'tradingView'
}

export abstract class AlertsGateway {
  abstract cresteAlert(dto: any, conditionId: string, userId:string): Promise<Alert>;
  abstract messagePattern(options:{ alertId: string }): string;
  abstract conditionTriggeredEventEmiter(dto: any): void;
}
