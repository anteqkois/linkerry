import { IStrategyExpand, IStrategy_StrategyBuyExpanded } from '@market-connector/types'
import { CustomNodeId, CustomNodeType, IAddNode, IStrategyBuyNode, IStrategyNode } from '../types'

type NodeConfig = {
  width: number
  height: number
}

export const nodeConfigs: Record<CustomNodeType, NodeConfig> & { gap: { x: number; y: number } } = {
  gap: {
    x: 40,
    y: 40,
  },
  AddNode: {
    width: 139,
    height: 40,
  },
  StrategyNode: {
    width: 384,
    height: 428,
  },
  StrategyBuyNode: {
    width: 384,
    height: 290,
  },
  ConditionNode: {
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

export const addNodeFactory = ({
  parentNodeId,
  x,
  y,
  variant,
  text,
}: {
  parentNodeId: CustomNodeId
  x: number
  y: number
  variant: CustomNodeType
  text: string
}): IAddNode => ({
  id: 'Add_Temp',
  type: 'AddNode',
  position: { x, y },
  data: {
    parentNodeId,
    variant,
    text,
  },
  parentNode: parentNodeId,
})
