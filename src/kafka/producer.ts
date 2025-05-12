import { producer } from "../connection/kafka";
import { ChatEventEnum } from "../socket/constant";
import kafkaConsumer from "./consumer";

const kafkaProducer = async (topicName: string, payload: any) => {
  try {
    await producer.connect();
    console.log("Kafka producer connected.");
    console.log("Syncing payload to kafka producer", payload);
    const response = await producer.send({
      topic: topicName,
      messages: [{ key: topicName.toString(), value: payload.toString() }],
    });

    console.log("Kafka payload response", JSON.stringify(response));

    console.log("Message produced successfully");

    await producer.disconnect();
  } catch (error) {
    console.log("Error", error);
  }
};

export default kafkaProducer;


