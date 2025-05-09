export default interface PubSubMessage {
    id: string;
    channel: string;
    timestamp: number;
    payload: string | Buffer;
    responseChannel?: string;
    status?: "pending" | "acknowledged";
  }
  