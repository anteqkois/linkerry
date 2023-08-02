import { IStrategyBuy_Condition, Id } from "@market-connector/types";
import { IsMongoId } from "class-validator";

export class CreateStrategyBuyCondition implements IStrategyBuy_Condition {
  @IsMongoId()
  readonly id: Id
}
