"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerProvider = void 0;
const microservices_1 = require("@nestjs/microservices");
const brokerURLs = ['localhost:29092'];
exports.KafkaProducerProvider = {
    provide: "CONDITION-PRODUCER",
    useFactory: () => {
        const kafkaClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.KAFKA,
            options: {
                client: {
                    clientId: 'external-alerts-0',
                    brokers: ['localhost:29092'],
                },
                producer: {
                    allowAutoTopicCreation: true,
                }
            },
        });
        return kafkaClient.connect();
    },
};
//# sourceMappingURL=kafka-producer.provider.js.map