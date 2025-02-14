"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
// import cookie from "cookie"
const cookie = __importStar(require("cookie"));
let user;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user = req === null || req === void 0 ? void 0 : req.body;
    if (user.name == null ||
        user.phone == null ||
        user.email == null ||
        user.password == null) {
        res.status(400).send({ error: "please provide all values" });
        return;
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptPassword = yield bcrypt_1.default.hash(user.password, salt);
        user.password = encryptPassword;
        let newUser = new userModel_1.default(user);
        newUser = yield newUser.save();
        console.log("the user register in success");
        res.status(200).send(newUser);
    }
    catch (err) {
        res.status(400).send({ error: "Fail in register" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user = req === null || req === void 0 ? void 0 : req.body;
    if (user.email == null || user.password == null) {
        res.status(400).send({ error: "please provide email and password" });
        return;
    }
    try {
        const findUser = yield userModel_1.default.findOne({ email: user.email });
        if (findUser == null) {
            res.status(400).send({ error: "Not find user" });
            return;
        }
        const match = yield bcrypt_1.default.compare(user.password, findUser.password);
        if (!match) {
            res.status(400).send({ error: "incorrect email or password" });
            return;
        }
        let accessToken = null;
        if (req.body.isTest) {
            //for check expired time in test
            accessToken = jsonwebtoken_1.default.sign({ _id: findUser._id.toString() }, env_1.config.access_token, { expiresIn: env_1.config.test_expiration });
        }
        else {
            accessToken = jsonwebtoken_1.default.sign({ _id: findUser._id.toString() }, env_1.config.access_token, { expiresIn: env_1.config.token_expiration });
        }
        const cookieOption = {
            secure: true,
            httpOnly: true,
        };
        console.log(cookie);
        const cookieString = cookie.serialize('accessToken', accessToken, cookieOption);
        res.status(200).send({
            accessToken: accessToken,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "Fail in login" });
    }
});
const getAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({});
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send({ err: "fail in get all data" });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
module.exports = { login, register, getAllData };
//# sourceMappingURL=authentication.js.map