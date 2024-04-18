import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe'
import { Id, Price, Product, ProjectOwnerPopulated, SubscriptionPeriod, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Stripe } from 'stripe'

@Injectable()
export class StripeService {
	constructor(@InjectStripeClient() private readonly stripeClient: Stripe, private readonly configService: ConfigService) {
		//
	}

	@StripeWebhookHandler('customer.subscription.created')
	customerSubscriptionCreated(event: Stripe.CustomerSubscriptionCreatedEvent) {
		console.log(event.data.object.customer)
		// execute your custom business logic
	}

	private async _getCustomerOrCreate({ project }: { project: ProjectOwnerPopulated }) {
		let customer = (
			await this.stripeClient.customers.search({
				query: `metadata["projectId"]:"${project._id}"`,
			})
		).data[0]

		if (!customer) {
			customer = await this.stripeClient.customers.create({
				name: project.displayName,
				email: project.owner.email,
				phone: String(project.owner.phone),
				preferred_locales: [project.owner.language || 'pl'],
				metadata: {
					projectId: project._id,
				},
			})
		}

		return customer
	}

	async createSubscriptionCheckoutSession({
		paymentIems,
		project,
	}: CreateSubscriptionCheckoutSessionProps): Promise<CreateSubscriptionCheckoutSessionRespons> {
		const customer = await this._getCustomerOrCreate({ project })

		const session = await this.stripeClient.checkout.sessions.create({
			customer: customer.id,
			mode: 'subscription',
			line_items: paymentIems.map((item) => ({
				price: item.price.stripe.id,
				quantity: 1,
			})),
			subscription_data: {
				metadata: {
					projectId: project._id,
				},
			},
			success_url: `${this.configService.getOrThrow('FRONTEND_HOST')}/app/payments/success`,
			cancel_url: `${this.configService.getOrThrow('FRONTEND_HOST')}/app/subscriptions`,
		})

		assertNotNullOrUndefined(session.url, 'missing payment url')
		console.dir(session, { depth: null })

		return { paymentUrl: session.url, subscriptionId: session!.subscription as string }
	}
}

interface CreateSubscriptionCheckoutSessionProps {
	project: ProjectOwnerPopulated
	period: SubscriptionPeriod
	paymentIems: PaymentItem[]
}

interface CreateSubscriptionCheckoutSessionRespons {
	paymentUrl: string
	subscriptionId: string
}

export interface PaymentItem {
	product: Product
	price: Price
}

export interface StripeCustomerMetadata {
	projectId: Id
}
