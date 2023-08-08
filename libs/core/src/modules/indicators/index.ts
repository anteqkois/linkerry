import { IndicatorType } from "@market-connector/types";

export const indicatorToFunction: Record<IndicatorType, Function> =  {
  [IndicatorType.Default]: (x: any)=> x,
  [IndicatorType.RSI]: (x: any)=> x,
}
