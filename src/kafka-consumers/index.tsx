import kafkaConsumer from "../kafka/consumer";
import { ChatEventEnum } from "../socket/constant";

kafkaConsumer(ChatEventEnum.NEW_CHAT_EVENT);