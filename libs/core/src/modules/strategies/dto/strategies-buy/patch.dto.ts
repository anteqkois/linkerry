import { IsBoolean, IsOptional } from 'class-validator'
import { PatchStrategytBuyDto } from '../../../strategies-buy/dro/patch.dto'

export class PatchStrategyStrategyBuyDto extends PatchStrategytBuyDto {
  @IsOptional()
  @IsBoolean()
  readonly active?: boolean
}
