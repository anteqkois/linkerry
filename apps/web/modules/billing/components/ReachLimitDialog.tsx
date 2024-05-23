'use client'

import { PlanConfigurationDetailsValue, PlanProductConfiguration, planConfigurationDetails } from '@linkerry/shared'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@linkerry/ui-components/client'
import { Button } from '@linkerry/ui-components/server'
import Link from 'next/link'
import { HTMLAttributes } from 'react'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { useSubscriptions } from '../subscriptions/useSubscriptions'
import { useUsage } from '../usage/useUsage'
import { useReachLimitDialog } from '../useReachLimitDialog'
import { ConfigurationItem } from './ConfigItem'

export interface ReachLimitDialogProps extends HTMLAttributes<HTMLElement> {}

export const ReachLimitDialog = () => {
  const { showDialog, setShowDialog, exceededConfigurationEntry, setCustomConfigurationItemValues, customConfigurationItemValues } =
    useReachLimitDialog()
  const { currentSubscription, currentPlan, subscriptionsError, subscriptionsStatus } = useSubscriptions()
  const { usage, usageError, usageStatus } = useUsage()

  return (
    // TODO show highter plan to the right
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-dialog">
        <DialogHeader>
          <DialogTitle>Reach Plan Limit</DialogTitle>
          {exceededConfigurationEntry ? (
            <DialogDescription>
              You reach <span className="font-bold text-primary-foreground">&quot;{exceededConfigurationEntry.displayName}&quot;</span> plan limit.
              You can upgrade plan and get more time with <span className="font-bold text-primary">Linkerry</span>.
            </DialogDescription>
          ) : (
            <DialogDescription>
              You reach one of your plan limit. You can upgrade plan and get more time with <span className="font-bold text-primary">Linkerry</span>.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="my-2">
          <p className="mb-2">Current Plan Usage</p>
          {subscriptionsError || usageError ? <ErrorInfo errorObject={subscriptionsError || usageError} /> : null}
          {subscriptionsStatus === 'pending' || usageStatus === 'pending' ? <Spinner /> : null}
          {usage && currentSubscription ? (
            (Object.entries(planConfigurationDetails) as [keyof PlanProductConfiguration, PlanConfigurationDetailsValue][]).map(([name, value]) => {
              let itemValue = customConfigurationItemValues[name]
              if (!itemValue) itemValue = usage[name] ? `${usage[name]} / ${currentPlan?.config[name]}` : '-'

              return (
                <ConfigurationItem
                  key={name}
                  className={name === exceededConfigurationEntry?.name ? 'text-negative hover:text-negative' : ''}
                  label={value.displayName}
                  value={itemValue}
                />
              )
            })
          ) : (
            <ErrorInfo message="Can not retrive your subscription or your usage" />
          )}
        </div>

        <DialogFooter>
          <Link href="/app/subscriptions">
            <Button
              type="submit"
              onClick={() => {
                setShowDialog(false)
                setCustomConfigurationItemValues({})
              }}
            >
              Upgrade to Higher Plan
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
