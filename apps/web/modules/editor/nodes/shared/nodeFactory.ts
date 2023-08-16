import { IStrategy_StrategyBuyExpanded } from '@market-connector/types'
import { CustomNodeId, CustomNodeType, IAddStrategyBuyNode, IStrategyBuyNode } from '../types'

type NodeConfig = {
  width: number
  height: number
}

export const nodeConfigs: Record<CustomNodeType, NodeConfig> & { gap: { x: number; y: number } } = {
  gap: {
    x: 40,
    y: 40
  },
  StrategyNode: {
    width: 384,
    height: 376,
  },
  AddStrategyBuyNode: {
    width: 139,
    height: 40,
  },
  StrategyBuyNode: {
    width: 0,
    height: 0,
  },
}

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
  parentNode,
}: {
  strategyBuy?: IStrategy_StrategyBuyExpanded
  parentNode: CustomNodeId
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
