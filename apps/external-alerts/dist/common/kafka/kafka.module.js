"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let KafkaModule = exports.KafkaModule = class KafkaModule {
};
exports.KafkaModule = KafkaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'CONDITION-PRODUCER',
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'external-alerts-0',
                            brokers: ['localhost:29092'],
                        },
                        consumer: {
                            groupId: 'condition',
                        },
                    },
                },
            ]),
        ],
        exports: [microservices_1.ClientsModule],
    })
], KafkaModule);
//# sourceMappingURL=kafka.module.js.map