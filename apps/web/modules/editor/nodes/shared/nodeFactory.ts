import { IStrategyExpand, IStrategy_StrategyBuyExpanded } from '@market-connector/types'
import { CustomNodeId, CustomNodeType, IAddStrategyBuyNode, IStrategyBuyNode, IStrategyNode } from '../types'

type NodeConfig = {
  width: number
  height: number
}

export const nodeConfigs: Record<CustomNodeType, NodeConfig> & { gap: { x: number; y: number } } = {
  gap: {
    x: 40,
    y: 40,
  },
  StrategyNode: {
    width: 384,
    height: 428,
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

export const strategyNodeFactory = ({
  strategy,
}: {
  strategy?: IStrategyExpand<'strategyBuy.strategyBuy'>
}): IStrategyNode => {
  return {
    id: `Strategy_${strategy?._id ?? 'Temp'}`,
    type: 'StrategyNode',
    position: { x: 0, y: 0 },
    data: {
      strategy,
    },
  }
}

export const strategyBuyNodeFactory = ({
  strategyBuy,
  parentNode,
  x,
  y,
}: {
  strategyBuy?: IStrategy_StrategyBuyExpanded
  parentNode: CustomNodeId
  x: number
  y: number
}): IStrategyBuyNode => {
  return {
    id: `StrategyBuy_${strategyBuy?.id ?? 'Temp'}`,
    type: 'StrategyBuyNode',
    position: { x, y },
    data: {
      strategyBuy,
    },
    parentNode,
  }
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
