import express from "express";
const server = express();

import bodyParser from "body-parser";
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

import mongoose from "mongoose";
import { config } from "./utils/config";
mongoose.connect(config.db_url);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connect to DB"));

import userRouter from "./routers/userRouter";
server.use("/user", userRouter);

export = server;
