import { IndicatorType } from "./types";

export const indicatorToFunction: Record<IndicatorType, Function> =  {
  default: (x: any)=> x,
  rsi: (x: any)=> x,
}

export * from "./types";
