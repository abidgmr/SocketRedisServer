import { publisher } from "../connection/redis";
import PubSubMessage from "../types";

const handleMessage = async (channel: string, message: string) => {
  try {
    const payload = JSON.parse(message);
    console.log(`Received message on ${channel}: ${JSON.stringify(payload)}`);

    if (payload.responseChannel) {
      const responsePayload: PubSubMessage = {
        id: payload.id,
        channel: payload.responseChannel,
        timestamp: Date.now(),
        payload: `Acknowledgment for ${payload.id}`,
      };

      await publisher.publish(payload.responseChannel, JSON.stringify(responsePayload));
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

export default handleMessage;
