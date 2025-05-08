import { subscriber } from "../connection";
import handleMessage from "../handler/message-handler";


// Subscriber for redis publisher
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
// subscriber.on("group", handleMessage);
