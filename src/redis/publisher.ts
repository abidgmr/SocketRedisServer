import { publisher } from "../connection";
import { v4 as uuidv4 } from "uuid";
import PubSubMessage from "../types";

const publish = (channel: string, message: string | Buffer) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const responseChannel = `${channel}:responses`;

    const payload: PubSubMessage = {
      id,
      channel,
      timestamp: Date.now(),
      payload: message,
      responseChannel,
    };

    const responseSubscriber = publisher.duplicate();

    responseSubscriber.subscribe(responseChannel, (err) => {
      if (err) {
        reject(`Error subscribing to response channel: ${err.message}`);
        return;
      }
    });

    responseSubscriber.on("message", (respChannel, response) => {
      try {
        const parsed = JSON.parse(response) as PubSubMessage;

        if (parsed.id === id) {
          resolve(`Acknowledgment received for ID ${id}: ${parsed.payload}`);
          responseSubscriber.unsubscribe(responseChannel);
          responseSubscriber.quit();
        }
      } catch (err) {
        reject(`Error processing response: ${err}`);
      }
    });

    let errorStatus = false;
    publisher.publish(
      channel,
      JSON.stringify(payload),
      (err, numSubscribers) => {
        if (err) {
          errorStatus = true;
          reject(`Error publishing message: ${err.message}`);
        } else if (numSubscribers === 0) {
          errorStatus = true;
          reject("No subscribers available");
        }
      }
    );

    if (!errorStatus)
      console.log(
        `Published message on channel: ${channel} with payload: ${JSON.stringify(
          payload
        )}`
      );
  });
};

export default publish;
