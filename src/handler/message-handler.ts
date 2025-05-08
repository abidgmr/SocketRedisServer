import publish from "../redis/publisher";

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
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

export default handleMessage;


