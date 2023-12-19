import { IStrategy_GetQuery } from "@market-connector/types";
import { PaginationDto } from "../../../lib/utils/dto/pagination.dto";

export class GetStrategiesQueryDto extends PaginationDto implements IStrategy_GetQuery{}
