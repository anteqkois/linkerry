import { Price, Product } from '@linkerry/shared'
import { ButtonClient, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Icons, P } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, useMemo } from 'react'

const planContainerVariants = cva('', {
  variants: {
    variant: {
      default: '',
      featured: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Comming features + rocket icon ?
export interface PlanCardProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof planContainerVariants> {
  product: Product
  price: Price
  onSelectPlan: (data: { productPlan: Product; price: Price }) => void
  priceSlot?: JSX.Element
  loading?: boolean
  config: {
    buttonLabel?: string
    lowerPlan?: string
    buttonVariant: ButtonProps['variant']
    // popular?: boolean //Recommended -> slot element
    points: { point: string; unfinished: boolean }[]
    disclaimer?: string
    disabledMessage?: string
    priceEarlyAccees?: number
  }
}

export const PlanCard = ({ price, product, className, config, onSelectPlan, priceSlot, children, loading }: PlanCardProps) => {
  const avaibleFeatures = useMemo(() => {
    return config.points.filter((entry) => !entry.unfinished)
  }, [config.points])

  const commingFeatures = useMemo(() => {
    return config.points.filter((entry) => entry.unfinished)
  }, [config.points])

  return (
    <Card className={cn('relative', className)}>
      <CardHeader className="h-32 md:h-40 xl:h-36">
        <CardTitle className="text-4xl font-bold">{product.name}</CardTitle>
        <CardDescription>{product.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 mt-2 relative w-full h-10">
          {priceSlot ? (
            priceSlot
          ) : (
            <div className="flex-center">
              <div className="relative">
                <span className="absolute -top-1 -left-14 text-xl">{currencyCodeToSign[price.currencyCode]}</span>
                <span className="text-4xl -ml-10 font-medium">{price.price}</span>
                <span className="text-lg absolute bottom-0.5 pl-1 whitespace-nowrap">/ {price.period}</span>
              </div>
            </div>
          )}
        </div>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ButtonClient
                loading={loading}
                className="w-full font-bold"
                variant={config.buttonVariant}
                onClick={() =>
                  config.disabledMessage
                    ? null
                    : onSelectPlan({
                        productPlan: product,
                        price,
                      })
                }
              >
                {config.buttonLabel ?? 'Choose Plan'}
              </ButtonClient>
            </TooltipTrigger>
            {config.disabledMessage ? (
              <TooltipContent>
                <p>{config.disabledMessage}</p>
              </TooltipContent>
            ) : null}
          </Tooltip>
        </TooltipProvider>
        {/* <Button
					disabled={config.currentPlan}
					className="w-full font-bold"
					variant={config.buttonVariant}
					onClick={() =>
						onSelectPlan({
							productPlan: product,
							price,
						})
					}
				>
					{config.buttonLabel ?? 'Choose Plan'}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline">Hover</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Add to library</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Button> */}
      </CardContent>
      <CardFooter className="flex flex-col">
        {config.lowerPlan ? <P className="font-bold mb-2">Everything in {config.lowerPlan}, plus:</P> : null}
        {avaibleFeatures.map((point, index) => (
          <div key={index} className="w-full flex space-y-1">
            <Icons.Check size={'md'} className="min-h-[22px] max-h-[22px] min-w-[22px] max-w-[22px] mr-2 mt-1.5" />
            <p>{point.point}</p>
          </div>
        ))}
        {commingFeatures.length ? (
          <P className="font-bold mb-2 text-primary-text flex items-center">
            <Icons.Rocket size={'md'} className="min-h-[15px] max-h-[15px] min-w-[15px] max-w-[15px] ml-1.5 mr-2" />
            Coming Soon Features
          </P>
        ) : null}
        {commingFeatures.map((point, index) => (
          <div key={index} className="w-full flex space-y-1">
            <Icons.Check size={'md'} className="min-h-[22px] max-h-[22px] min-w-[22px] max-w-[22px] mr-2 mt-1.5" />
            <p>{point.point}</p>
          </div>
        ))}
        {/* <Muted >{config.disclaimer}</Muted> */}
        <p className="mt-2 text-muted-foreground text-xs leading-4 pl-5">{config.disclaimer}</p>
      </CardFooter>
      {children}
    </Card>
  )
}

const currencyCodeToSign: Record<string, string> = {
  USD: '$',
}
