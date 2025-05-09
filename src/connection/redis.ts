import Redis from "ioredis";

const publisher = new Redis(6379);
const subscriber = new Redis(6379);

export {publisher, subscriber};