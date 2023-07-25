import { IndicatorType } from "@market-connector/types";

export const indicatorToFunction: Record<IndicatorType, Function> =  {
  default: (x: any)=> x,
  rsi: (x: any)=> x,
}
