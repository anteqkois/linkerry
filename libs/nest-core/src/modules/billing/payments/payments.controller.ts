import { Controller } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class paymentsController {
  constructor(private readonly stripeService: StripeService) {}
}
