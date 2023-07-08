"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConditionModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionModule = void 0;
const common_1 = require("@nestjs/common");
const kafka_module_1 = require("../../common/kafka/kafka.module");
const condition_consumer_1 = require("./condition.consumer");
const condition_controller_1 = require("./condition.controller");
let ConditionModule = exports.ConditionModule = ConditionModule_1 = class ConditionModule {
};
exports.ConditionModule = ConditionModule = ConditionModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            ConditionModule_1,
            kafka_module_1.KafkaModule
        ],
        controllers: [condition_controller_1.ConditionController],
        providers: [condition_consumer_1.ConditionConsumer]
    })
], ConditionModule);
//# sourceMappingURL=condition.module.js.map