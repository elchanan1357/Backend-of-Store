import express from "express";
const server = express();

import cors from "cors";
// server.use(cors());
server.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);

import cookieParser from "cookie-parser";
server.use(cookieParser());

import bodyParser from "body-parser";
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

import mongoose from "mongoose";
import { config } from "./utils/config";
mongoose.connect(config.db_url);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connect to DB"));

import AuthRouter from "./routers/authRouter";
import favoritesCartRouters from "./routers/favoritesCartRouters";
server.use("/user", AuthRouter);
server.use("/user", favoritesCartRouters);

export = server;
