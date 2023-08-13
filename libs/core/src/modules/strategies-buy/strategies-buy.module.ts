import { Module } from '@nestjs/common';
import { StrategiesBuyService } from './strategies-buy.service';
import { StrategiesBuyController } from './strategies-buy.controller';
import { StrategyBuy, StrategyBuySchema } from './schemas/strategy-buy.schema';
import { StrategyBuyStaticMarket, StrategyBuyStaticMarketSchema } from './schemas/strategy-buy-static-market.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConditionsModule } from '../conditions';

const STRATEGIES_BUY_MODELS = [
  {
    name: StrategyBuy.name,
    useFactory: () => {
      const schema = StrategyBuySchema;
      schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
      return schema;
    },
    discriminators: [
      {
        name: StrategyBuyStaticMarket.name,
        schema: StrategyBuyStaticMarketSchema,
        useFactory: () => {
          const schema = StrategyBuyStaticMarketSchema;
          schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
          return schema;
        },
      },
    ],
  },
];

@Module({
  imports:[
    MongooseModule.forFeatureAsync([...STRATEGIES_BUY_MODELS]),
    ConditionsModule
  ],
  controllers: [StrategiesBuyController],
  providers: [StrategiesBuyService],
  exports: [StrategiesBuyService],
})
export class StrategiesBuyModule {}
