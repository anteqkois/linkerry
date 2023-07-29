import { AlertProviderType, ICondition } from "@market-connector/types";

export abstract class ConditionTypeGateway {
  abstract createCondition(dto: any, userId:string): Promise<ICondition>;
}

export abstract class AlertProviderGateway {
  abstract createAlert(dto: {conditionId: string, provider: AlertProviderType}): ICondition['alert'];
  abstract messagePattern(options:{ conditionId: string }): string;
  abstract conditionTriggeredEventEmiter(dto: any): void;
}
