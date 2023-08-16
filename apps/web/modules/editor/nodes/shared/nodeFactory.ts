import { IStrategy_StrategyBuyExpanded } from '@market-connector/types'
import { CustomNodeId, IAddStrategyBuyNode, IStrategyBuyNode } from '../types'

export const addBuyStrategyNodeFactory = ({
  parentNodeId,
  x,
  y,
}: {
  parentNodeId: CustomNodeId
  x: number
  y: number
}): IAddStrategyBuyNode => ({
  id: 'AddStrategyBuy_Temp',
  type: 'AddStrategyBuyNode',
  position: { x, y },
  data: {
    parentNodeId: parentNodeId,
  },
  parentNode: parentNodeId,
})

export const strategyBuyNodeFactory = ({
  strategyBuy,
  parentNode
}: {
  strategyBuy?: IStrategy_StrategyBuyExpanded
  parentNode: CustomNodeId,
}): IStrategyBuyNode => {
  return {
    id: `StrategyBuy_${strategyBuy?.id ?? 'Temp'}`,
    type: 'StrategyBuyNode',
    position: { x: 0, y: 450 },
    data: {
      strategyBuy,
    },
    parentNode,
  }
}
