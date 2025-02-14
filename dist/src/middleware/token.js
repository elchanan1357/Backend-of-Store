"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeaders = req.headers.authorization;
    if (authHeaders == null)
        res.status(400).send({ error: "authentication missing" });
    const accessToken = authHeaders.split(" ")[1];
    if (accessToken == null)
        res.status(400).send({ error: "authentication missing" });
    try {
        const user = jsonwebtoken_1.default.verify(accessToken, env_1.config.access_token);
        req.body.userID = user._id;
        next();
    }
    catch (err) {
        res.status(400).send({ error: "fail validating token" });
    }
});
module.exports = { middleware };
//# sourceMappingURL=token.js.map