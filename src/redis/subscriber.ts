import { subscriber } from "../connection";
import publish from "./publisher";

const handleMessage = async (channel: string, message: string) => {
  try {
    const { message: msg, responseChannel } = JSON.parse(message);

    console.log(`Received message on ${channel}:`, msg, responseChannel);

    if (responseChannel) {
      try {
        const status = await publish(
          responseChannel,
          `Message received on 2 ${channel}`
        );
        if (status) {
          console.log(`Response published on channel: ${channel}`);
        }
      } catch (error) {}
    }

    subscriber.subscribe(responseChannel, (err, count) => {
      if (err) {
        console.error("Subscription error:", err);
        return;
      }
      console.log(`Subscribed to ${count} channel(s).`);
    });
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

subscriber.subscribe("message", (err, count) => {
  if (err) {
    console.error("Subscription error:", err);
    return;
  }
  console.log(`Subscribed to ${count} channel(s).`);
});

subscriber.subscribe("group", (err, count) => {
  if (err) {
    console.error("Subscription error:", err);
    return;
  }
  console.log(`Subscribed to ${count} channel(s).`);
});

subscriber.on("message", handleMessage);
