"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const server_1 = __importDefault(require("./server"));
server_1.default.listen(env_1.config.port, () => console.log("Server start in port: ", env_1.config.port));
//# sourceMappingURL=app.js.map