import publish from "../../redis/publisher";
import { ExtendedSocket } from "../../socket";
import { ChatEventEnum } from "../../socket/constant";
import { Server as SocketIOServer } from "socket.io";

const event = (
  event: string,
  socket: ExtendedSocket,
  io: SocketIOServer
): void => {
  socket.on(event, (payload: any) => {
    if (payload && payload.chatId) {
      publish(event, payload);
      io.to(payload.chatId).emit(event, payload);
    }
  });
};

const incomingEvent = (socket: ExtendedSocket, io: SocketIOServer): void => {
  event(ChatEventEnum.NEW_CHAT_EVENT, socket, io);
};

export default incomingEvent;
