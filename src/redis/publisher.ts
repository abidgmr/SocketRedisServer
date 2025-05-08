import { publisher } from "../connection";
import { v4 as uuidv4 } from "uuid";

const publish = async (channel: string, message: string | Buffer) => {
  return new Promise((resolve, reject) => {
    const responseChannel = `${channel}:response:${uuidv4()}`;

    const payload = JSON.stringify({
      message,
      responseChannel,
    });

    const responseSubscriber = publisher.duplicate();
    responseSubscriber.subscribe(responseChannel, (err, count) => {
      if (err) {
        reject(`Error subscribing to response channel: ${err.message}`);
        return;
      }
    });

    responseSubscriber.on("message", (channel, response) => {
      resolve(`Acknowledgment received: ${response} from channel ${channel}`);
      responseSubscriber.unsubscribe(responseChannel);
      responseSubscriber.quit();
    });

    publisher.publish(channel, payload, (err, numSubscribers) => {
      console.log(`1 Publish to ${channel} with ${payload} `);
      if (err) {
        reject(`Error publishing message: ${err.message}`);
      } else if (numSubscribers === 0) {
        reject("No subscribers available");
      }
    });
  });
};

export default publish;
