import { StripeModule as GolevelupStripeModule } from '@golevelup/nestjs-stripe'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { PriceModelFactory } from '../products/prices/price.schema'
import { ProductModelFactory } from '../products/product.schema'
import { paymentsController } from './payments.controller'
import { StripeService } from './stripe.service'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([ProductModelFactory, PriceModelFactory]),
    GolevelupStripeModule.forRootAsync(GolevelupStripeModule, {
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          apiVersion: '2024-04-10',
          apiKey: configService.getOrThrow('STRIPE_API_KEY'),
          webhookConfig: {
            // decorators: [SkipThrottle()],
            stripeSecrets: {
              account: configService.getOrThrow('STRIPE_WEBHOOK_SECRET'),
              accountTest: configService.getOrThrow('STRIPE_WEBHOOK_SECRET'),
            },
            requestBodyProperty: 'rawBody',
          },
        }
      },
    }),
    ConfigModule,
  ],
  controllers: [paymentsController],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}
