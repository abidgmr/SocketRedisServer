import { publisher } from "../connection/redis";
import PubSubMessage from "../types";

const handleMessage = async (channel: string, message: string) => {
  try {
    const payload = JSON.parse(message);
    console.log(`Received message on ${channel}: ${JSON.stringify(payload)}`);

    const response: Partial<PubSubMessage> = {};
    (response.id = payload.id),
      (response.timestamp = Date.now()),
      (response.payload = `Acknowledgment for ${payload.id}`);

    if (payload.responseChannel) {
      (response.channel = payload.responseChannel),
        (response.status = "acknowledged");

      await publisher.publish("acknowledgment", JSON.stringify(response));
    } 
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

export default handleMessage;
