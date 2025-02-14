"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    access_token: process.env.ACCESS_TOKEN_SECRET,
    token_expiration: process.env.TOKEN_EXPIRATION,
    test_expiration: process.env.TOKEN_EXPIRATION_TEST,
};
//# sourceMappingURL=env.js.map