import { subscriber } from "../connection/redis";
import handleMessage from "../handler/message-handler";
import { ChatEventEnum } from "../socket/constant";

subscriber.subscribe(ChatEventEnum.NEW_CHAT_EVENT, (err, count) => {
  if (err) {
    console.error("Subscription error:", err);
    return;
  }
  console.log(`Subscribed to ${count} channel(s).`);
});

subscriber.subscribe("acknowledgment", (err, count) => {
  if (err) {
    console.error("Subscription error:", err);
    return;
  }
  console.log(`Subscribed to ${count} channel(s).`);
});

subscriber.on("message", handleMessage);
