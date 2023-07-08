import { Transport, ClientProxyFactory } from "@nestjs/microservices";
import { Producer } from "kafkajs";
const brokerURLs = ['localhost:29092'];

export const KafkaProducerProvider = {
  provide: "CONDITION-PRODUCER",
  useFactory: (): Promise<Producer> => {
    const kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'external-alerts-0',
          brokers: ['localhost:29092'],
        },
        // consumer: {
        //   groupId: 'condition',
        // },
        producer: {
          allowAutoTopicCreation: true,
        }
      },
    });
    return kafkaClient.connect();
  },
};
