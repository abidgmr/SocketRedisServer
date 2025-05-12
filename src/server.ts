"use strict";
import "reflect-metadata";
import { SocketServer } from "./socket";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import express, { Express } from "express";
import clientIdMiddleware from "./middleware/clientid.middleware";
import requestIp from "request-ip";
import path from "path";
import session from "express-session";
import { authentication } from "./middleware/authentication.middleware";
import dotenv from "dotenv";
import cors from "cors";
import limiter from "./helper/limiter";

const app: Express = express();

dotenv.config();
const publicPath = path.join(__dirname, "../public");

app.get("/", (req, res) => {
  res.send("Welcome to redis kafka server");
});
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["clientid", "authorization"],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(clientIdMiddleware);
app.use(requestIp.mw());
app.use(limiter);
app.use(
  session({
    secret: process.env.JWT_SECRET || "",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "strict", httpOnly: true },
  })
);
app.use(authentication);
app.use(express.static(publicPath));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use((req, _res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

const httpServer = http.createServer(app);
const socketServer = new SocketServer();
const io = new SocketIOServer(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["clientid", "authorization"],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200,
  },
});

socketServer.initializeSocketIO(io);

const port = process.env.WS_SERVER || 5000;
httpServer.listen(port, async () => {
  try {
    console.log(`Listening On 🌐 http://localhost:${port}`);
    console.log(`Worker ${process.pid} is running.`);
  } catch (error) {
    console.error("Error during server startup:", error);
    httpServer.close(() => {
      console.log("Server shut down due to DB connection failure.");
      process.exit(1);
    });
  }
});

process.on("SIGTERM", () => {
  console.log(`Worker ${process.pid} is shutting down`);
  httpServer.close(() => process.exit(0));
});

import "./connection/redis";
import "./redis/subscriber";
import "./redis/publisher";
import "./socket-redis/index";
import "./connection/kafka";
import "./events/kafka/index";
import "./kafka/consumer";
import "./kafka/producer";
import "./kafka-consumers/index";

export const getSocketServer = (): SocketServer => socketServer;
