import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import mongoose from "mongoose";
import { config } from "./utils/config";
import cookieParser from "cookie-parser";

import AuthRouter from "./routers/authRouter";
import favoritesCartRouters from "./routers/favoritesCartRouters";

const server = express();

server.use(
  cors({
    origin: config.cross_origin,
    credentials: true,
  })
);

server.use(cookieParser());

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

mongoose.connect(config.db_url);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connect to DB"));

server.use("/user", AuthRouter);
server.use("/user", favoritesCartRouters);

export = server;
