import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe'
import { Id, Price, Product, SubscriptionPeriod, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Stripe } from 'stripe'
import { ProjectDocument } from '../../projects/schemas/projects.schema'

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

	private async _getCustomerOrCreate({ project }: { project: ProjectDocument<'owner'> }) {
		let customer = (
			await this.stripeClient.customers.search({
				query: `metadata["projectId"]:"${project._id.toString()}"`,
			})
		).data[0]

		if (!customer) {
			customer = await this.stripeClient.customers.create({
				name: project.displayName,
				email: project.owner.email,
				phone: String(project.owner.phone),
				preferred_locales: [project.owner.language || 'pl'],
				metadata: {
					projectId: project._id.toString(),
				},
			})
		}

		return customer
	}

	async createFirstSubscription({
		paymentIems,
		project,
		subscriptionId,
	}: CreateSubscriptionCheckoutSessionProps): Promise<CreateSubscriptionCheckoutSessionRespons> {
		const customer = await this._getCustomerOrCreate({ project })

		const customerSessions = await this.stripeClient.checkout.sessions.list({
			customer: customer.id,
			expand: ['data.line_items', 'data.subscription'],
			status: 'open',
		})

		// /* to reset all checkot sessions */
		// for (const session of customerSessions.data) {
		// 	await this.stripeClient.checkout.sessions.expire(session.id)
		// }
		// customerSessions.data = []

		let openSessionsForThisPaymentItems: Stripe.Checkout.Session | null = null
		const sessionToExpired: string[] = []

		/* sessions are sorted starting from sessions with the longest expired at timestamp */
		for (const session of customerSessions.data) {
			/* Session found earlier */
			if (openSessionsForThisPaymentItems) sessionToExpired.push(session.id)

			const lineItems = session.line_items?.data ?? []

			/* check if all products are in checkout session */
			for (const paymentItem of paymentIems) {
				const lineItemIndex =
					lineItems.findIndex((lineItem) => {
						if (lineItem.price!.id === paymentItem.price.stripe.id && lineItem.price?.product === paymentItem.product.stripe.id) return true
						return false
					}) ?? -1
				if (lineItemIndex === -1) {
					sessionToExpired.push(session.id)
					/* not all products are in checout session */
					continue
				}
				lineItems.splice(lineItemIndex)
			}
			/* At the end it can not be any item => all items included in session, so they were deleted from array */
			if (lineItems.length) sessionToExpired.push(session.id)
			else openSessionsForThisPaymentItems = session
		}

		if (sessionToExpired.length) {
			for (const sessionId of sessionToExpired) {
				await this.stripeClient.checkout.sessions.expire(sessionId)
			}
		}

		if (openSessionsForThisPaymentItems && !openSessionsForThisPaymentItems?.url)
			await this.stripeClient.checkout.sessions.expire(openSessionsForThisPaymentItems.id)
		else if (openSessionsForThisPaymentItems && openSessionsForThisPaymentItems?.url)
			return {
				paymentUrl: openSessionsForThisPaymentItems.url,
			}

		const session = await this.stripeClient.checkout.sessions.create({
			customer: customer.id,
			mode: 'subscription',
			line_items: paymentIems.map((item) => ({
				price: item.price.stripe.id,
				quantity: 1,
			})),
			subscription_data: {
				metadata: {
					projectId: project._id.toString(),
					subscriptionId: subscriptionId.toString(),
				},
			},
			success_url: `${this.configService.getOrThrow('FRONTEND_HOST')}/app/payments/success`,
			cancel_url: `${this.configService.getOrThrow('FRONTEND_HOST')}/app/subscriptions`,
			metadata: {
				projectId: project._id.toString(),
				subscriptionId: subscriptionId.toString(),
			},
		})

		assertNotNullOrUndefined(session.url, 'missing payment url')

		return { paymentUrl: session.url }
	}
}

interface CreateSubscriptionCheckoutSessionProps {
	subscriptionId: Id
	project: ProjectDocument<'owner'>
	period: SubscriptionPeriod
	paymentIems: PaymentItem[]
}

interface CreateSubscriptionCheckoutSessionRespons {
	paymentUrl: string
}

export interface PaymentItem {
	product: Product
	price: Price
}

export interface StripeCustomerMetadata {
	projectId: Id
}
