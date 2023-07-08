"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const condition_consumer_1 = require("./condition.consumer");
let ConditionController = exports.ConditionController = class ConditionController {
    constructor(conditionService) {
        this.conditionService = conditionService;
    }
    readMessage(message, context) {
        const originalMessage = context.getMessage();
        const response = `Receiving a new message from topic: condition.triggered: ` +
            JSON.stringify(originalMessage.value);
        console.log(response);
        return response;
    }
};
__decorate([
    (0, microservices_1.MessagePattern)('condition.triggered'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.KafkaContext]),
    __metadata("design:returntype", void 0)
], ConditionController.prototype, "readMessage", null);
exports.ConditionController = ConditionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [condition_consumer_1.ConditionConsumer])
], ConditionController);
//# sourceMappingURL=condition.controller.js.map