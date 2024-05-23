declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // common
      PORT_API_GATEWAY: string

      KAFKA_CONDITION_GROUP_ID: string
      KAFKA_CONDITION_TOPIC_NAME: string
      KAFKA_BROKER_URL: string
      KAFKAJS_NO_PARTITIONER_WARNING: string

      MONGO_PROTOCOL: string
      MONGO_USERNAME: string
      MONGO_PASSWORD: string
      MONGO_HOST: string
      // MONGO_PORT: string,
      MONGO_DATABASE: string
      ALERT_HANDLER_URL: string
    }
  }
}
export {}
