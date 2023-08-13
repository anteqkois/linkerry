import { IStrategyBuy_PatchInput} from '@market-connector/types'
import { UpdateStrategyBuyDto } from './update.dto'
import { PartialType } from '@nestjs/mapped-types'

export class PatchStrategytDto extends PartialType(UpdateStrategyBuyDto) implements IStrategyBuy_PatchInput {}
