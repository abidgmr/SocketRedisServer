import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();
const consumer = (groupName: string) => {
  return kafka.consumer({ groupId: groupName });
};

export default consumer;
