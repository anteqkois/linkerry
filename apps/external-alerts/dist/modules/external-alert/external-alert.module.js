"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalAlertModule = void 0;
const common_1 = require("@nestjs/common");
const external_alert_service_1 = require("./external-alert.service");
const external_alert_controller_1 = require("./external-alert.controller");
const kafka_producer_provider_1 = require("../../common/kafka/kafka-producer.provider");
const config_1 = require("@nestjs/config");
let ExternalAlertModule = exports.ExternalAlertModule = class ExternalAlertModule {
};
exports.ExternalAlertModule = ExternalAlertModule = __decorate([
    (0, common_1.Module)({
        controllers: [external_alert_controller_1.ExternalAlertController],
        providers: [external_alert_service_1.ExternalAlertService, kafka_producer_provider_1.KafkaProducerProvider, config_1.ConfigService]
    })
], ExternalAlertModule);
//# sourceMappingURL=external-alert.module.js.map