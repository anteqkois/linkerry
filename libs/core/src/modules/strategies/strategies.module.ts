import { Module } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { StrategiesController } from './strategies.controller';
import { Strategy, StrategySchema } from './schemas/strategy.schema';
import { StrategyStaticMarket, StrategyStaticMarketSchema } from './schemas/strategy-buy-static-market.schema';
import { MongooseModule } from '@nestjs/mongoose';

const STRATEGIES_MODELS = [
  {
    name: Strategy.name,
    useFactory: () => {
      const schema = StrategySchema;
      schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
      return schema;
    },
    discriminators: [
      {
        name: StrategyStaticMarket.name,
        schema: StrategyStaticMarketSchema,
        useFactory: () => {
          const schema = StrategyStaticMarketSchema;
          schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
          return schema;
        },
      },
    ],
  },
];


@Module({
  imports:[
    MongooseModule.forFeatureAsync([...STRATEGIES_MODELS]),
  ],
  controllers: [StrategiesController],
  providers: [StrategiesService]
})
export class StrategiesModule {}
