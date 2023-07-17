import { Injectable, Optional, Inject, UnprocessableEntityException } from '@nestjs/common';
import { AlertProvidersType } from './types';
import { TradingViewTemplateArg, tradingViewMessagePattern } from './trading-view/trading-view.message';

type TemplateArgItem<A, T> = { alertProvider: A } & T

type TemplateArg = TemplateArgItem<AlertProvidersType.TRADING_VIEW, TradingViewTemplateArg>


const messageTemplates = {
  [AlertProvidersType.TRADING_VIEW]: tradingViewMessagePattern
}

@Injectable()
export class MessageProvider {
  constructor() { }

  getTemplate(templateArg: TemplateArg) {
    const pattern = messageTemplates[templateArg.alertProvider]
    if (!pattern) throw new UnprocessableEntityException(`Can not find message pattern for ${ templateArg.alertProvider }`)
    const message = pattern(templateArg)
    return message
  }
}
