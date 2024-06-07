import { PlanName, PlanProductConfiguration, Price, Product, ProductType, ProductWithPrices, SubscriptionPeriod } from '@linkerry/shared'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes, ReactNode, useCallback } from 'react'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { useProducts } from '../products/useProducts'
import { PlanCard, PlanCardProps } from './PlanCard'

export interface PlansProps extends HTMLAttributes<HTMLElement> {
  onSelectPlan: (data: { productPlan: Product; price: Price }) => void
  currentPlan?: Product | null
  loading?: boolean
}

export const Plans = ({ onSelectPlan, className, currentPlan, loading }: PlansProps) => {
  const { plans, plansError, plansStatus } = useProducts()

  const onSelectEnterPrise = useCallback(({ price, productPlan }: { productPlan: Product; price: Price }) => {
    // TODO
    console.debug(price, productPlan)
  }, [])

  if (plansStatus === 'pending') return <Spinner />
  if (plansStatus === 'error') return <ErrorInfo errorObject={plansError} />

  return (
    <div className={cn('pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3', className)}>
      {plans
        ?.filter((plan) => plan.visible)
        ?.map((plan) => {
          const config = plansConfig[plan.name as PlanName]
          console.log(currentPlan?.name);
          // console.log(plan.name);
          console.log('');
          if (currentPlan?.name === plan.name) {
            config.disabledMessage = 'It is your current plan'
            config.buttonLabel = 'Current Plan'
            config.buttonVariant = 'outline'
          }
          if ((currentPlan?.priority ?? 0) > plan.priority)
            config.disabledMessage = 'Downgrade plan is uniplemented. If you want downgrade plan contact with our Team'
          return (
            <PlanCard key={plan.name} price={plan.prices[0]} product={plan} config={config} onSelectPlan={onSelectPlan} loading={loading}>
              {config.children}
            </PlanCard>
          )
        })}
      <PlanCard
        key={enterPrisePlan.name}
        price={enterPrisePlan.prices[0]}
        product={enterPrisePlan}
        config={{ ...plansConfig.Enterprise, disabledMessage: currentPlan?.name === 'Enterprise' ? 'It is your current plan' : '' }}
        onSelectPlan={onSelectEnterPrise}
        priceSlot={<p className="text-center font-medium text-3xl sm:text-2xl lg:text-xl lg:leading-10 xl:text-2xl">Contact for pricing</p>}
        loading={loading}
      ></PlanCard>
    </div>
  )
}

const enterPrisePlan: ProductWithPrices = {
  _id: '785341762354671789234',
  name: 'Enterprise',
  type: ProductType.PLAN,
  config: {
    minimumPollingInterval: 2,
    connections: 'unlimited',
    connectors: 'all',
    tasks: 'unlimited',
    projectMembers: 'unlimited',
    flowSteps: 35,
    triggersAmount: 5,
    flows: 'unlimited',
    fileUploadsMB: 'unlimited',
    flowRunIntervalGap: 0,
    maximumActiveFlows: 'unlimited',
    maximumExecutionTime: 'unlimited',
  } as unknown as PlanProductConfiguration,
  priority: 4,
  visible: true,
  stripe: {
    id: 'prod_PwuZ7SPO0TCLue',
  },
  createdAt: '2024-04-18T19:36:56.045Z',
  updatedAt: '2024-04-18T19:36:56.045Z',
  shortDescription: 'Experience heightened security, access privileges and support. Access our cutting-edge automation functionalities.',
  prices: [
    {
      _id: '567829789123902823490',
      price: 0,
      period: SubscriptionPeriod.MONTHLY,
      default: true,
      productId: '',
      stripe: {
        id: '',
      },
      currencyCode: 'USD',
      priority: 1,
      visible: true,
      createdAt: '2024-04-18T19:40:59.063Z',
      updatedAt: '2024-04-18T19:40:59.063Z',
    },
  ],
}

const plansConfig: Record<PlanName, PlanCardProps['config'] & { children?: ReactNode }> = {
  Free: {
    buttonVariant: 'outline',
    points: [
      { point: 'No-code visual flow editor', unfinished: false },
      { point: 'Access to all Core Connectors', unfinished: false },
      { point: 'Testing flow before publish', unfinished: false },
      { point: 'Short Multi-steps flows', unfinished: false },
      { point: 'Connectros tiggered by webhook', unfinished: false },
      { point: 'Access to Flow veriables', unfinished: false },
    ],
  },
  Basic: {
    buttonVariant: 'default',
    lowerPlan: 'Free',
    disclaimer: "*Price will increase upon delivery of the 'Coming Soon Features'. Reduced rate now.",
    points: [
      { point: 'Pre Acceas to beta Connectors', unfinished: false },
      { point: 'Long Multi-steps flows', unfinished: false },
      { point: 'Minimum 2 minute pooling interval for Polling Triggers', unfinished: false },
      { point: 'Ability to set auto-repeat flow in case of failure', unfinished: true },
    ],
  },
  Professional: {
    buttonVariant: 'default',
    lowerPlan: 'Basic',
    disclaimer: "*Price will increase upon delivery of the 'Coming Soon Features'. Reduced rate now.",
    points: [
      { point: 'Pre Access for AI helper & AI generator', unfinished: true },
      // { point: 'AI Agents to create and perform the whole flow from input', unfinished: true },
      { point: 'Linkerry AGI to create and perform the whole flow from input', unfinished: true },
      { point: 'Voting system on the development order of connectors', unfinished: false },
      { point: 'Live notifications for Flow Runs and errors', unfinished: true },
      { point: 'Access to a Premium closed group', unfinished: false },
      { point: 'Up to 25 000 tasks / monthly', unfinished: false },
    ],
    children: (
      <span className="bg-primary px-4 py-1 text-sm text-primary-foreground font-medium rounded-lg absolute -top-3 right-6 shadow-2xl">
        Recommended
      </span>
    ),
  },
  Enterprise: {
    buttonVariant: 'default',
    buttonLabel: 'Contact Sales',
    lowerPlan: 'Professional',
    points: [
      {
        point: 'Unlimited Flows scenarios',
        unfinished: false,
      },
      {
        point: 'Annual tasks usage',
        unfinished: false,
      },
      {
        point: 'Enablement of all flows',
        unfinished: false,
      },
      {
        point: 'Limitless App connections',
        unfinished: false,
      },
      {
        point: 'Instant Team support',
        unfinished: false,
      },
      {
        point: 'Possibility to create dedicated Flow Worker',
        unfinished: false,
      },
      { point: 'Access to all "Coming Soon Features" from all plans', unfinished: true },
    ],
  },
}
