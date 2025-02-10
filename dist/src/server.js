"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
server.use(body_parser_1.default.urlencoded({ extended: true }));
server.use(body_parser_1.default.json());
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DB_URL);
const db = mongoose_1.default.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connect to DB"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
server.use("/user", userRouter_1.default);
module.exports = server;
//# sourceMappingURL=server.js.map