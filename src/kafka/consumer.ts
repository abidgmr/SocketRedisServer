import consumer from "../connection/kafka";
const kafkaConsumer = async (
  topicName: string,
  partition?: string,
  message?: any[],
  acceptanceType: string = "single"
) => {
  try {
    const consumers = consumer(topicName);
    await consumers.connect();
    console.log("Kafka consumer connected successfully");

    await consumers.subscribe({ topic: topicName, fromBeginning: true });
    console.log("Subscribed to topic successfully");

    if (acceptanceType === "single") {
      await consumers.run({
        eachMessage: async ({ topic, partition, message }) => {
          const valueString = message.value?.toString();
          const parsedValue = valueString ? JSON.parse(valueString) : null;
          console.log("Subscribed message", parsedValue);
        },
      });
    }
  } catch (error) {
    console.log("Error", error);
  }
};

export default kafkaConsumer;
