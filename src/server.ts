"use strict";
import "reflect-metadata";
import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();
import './connection/index';
import './redis/subscriber';
import './redis/publisher';
import './socket/index';

