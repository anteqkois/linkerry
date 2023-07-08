"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConditionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_condition_dto_1 = require("./create-condition.dto");
class UpdateConditionDto extends (0, mapped_types_1.PartialType)(create_condition_dto_1.CreateConditionDto) {
}
exports.UpdateConditionDto = UpdateConditionDto;
//# sourceMappingURL=update-condition.dto.js.map