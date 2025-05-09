import { getSocketServer } from "../../server";

const sendMessage = async (channel: string, message: string | Buffer) => {
  try {
    const socketServer = getSocketServer();
  } catch (error) {
    console.error("Error:", error);
  }
};

setInterval(() => {
  sendMessage("group", `Message at ${Date.now()}`);
}, 5000);
