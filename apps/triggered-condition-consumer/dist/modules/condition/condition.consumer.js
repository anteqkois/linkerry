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
exports.ConditionConsumer = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const create_condition_dto_1 = require("./dto/create-condition.dto");
let ConditionConsumer = exports.ConditionConsumer = class ConditionConsumer {
    constructor(client, configService) {
        this.client = client;
        this.configService = configService;
        this.topic = this.configService.get('KAFKA_CONDITION_TOPIC_NAME');
    }
    processTriggered(createConditionDto) {
        console.log({ receive: createConditionDto });
        return 'This action adds a new condition';
    }
};
__decorate([
    (0, microservices_1.EventPattern)('condition.triggered'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_condition_dto_1.CreateConditionDto]),
    __metadata("design:returntype", void 0)
], ConditionConsumer.prototype, "processTriggered", null);
exports.ConditionConsumer = ConditionConsumer = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONDITION-CONSUMER')),
    __metadata("design:paramtypes", [microservices_1.ClientKafka, config_1.ConfigService])
], ConditionConsumer);
//# sourceMappingURL=condition.consumer.js.map