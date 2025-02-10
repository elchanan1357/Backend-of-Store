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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, password } = req === null || req === void 0 ? void 0 : req.body;
    if (name == null || phone == null || email == null || password == null)
        res.status(400).send({ error: "Fail not got all value" });
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (user != null) {
            res.status(400).send({ error: "The user already exist" });
            return;
        }
    }
    catch (err) {
        res.status(400).send({ error: "Fail in search if user exist" });
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptPassword = yield bcrypt_1.default.hash(password, salt);
        let newUser = new userModel_1.default({
            name: name,
            phone: phone,
            email: email,
            password: encryptPassword,
        });
        newUser = yield newUser.save();
        console.log("the user register in success");
        res.status(200).send(newUser);
    }
    catch (err) {
        res.status(400).send({ error: "Fail in register" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req === null || req === void 0 ? void 0 : req.body;
    if (email == null || password == null)
        res.status(400).send({ error: "please provide email and password" });
    //////////////////////
    //todo
    try {
        const findUser = yield userModel_1.default.findOne({ email: email });
        if (findUser == null) {
            res.status(400).send({ error: "Can't find user" });
            return;
        }
        const match = yield bcrypt_1.default.compare(password, findUser.password);
        if (!match) {
            console.log(match);
            res.status(400).send({ error: "incorrect email or password" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: findUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });
        res.status(200).send({
            accessToken: accessToken,
        });
    }
    catch (err) {
        res.status(400).send({ error: "Fail in login" });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeaders = req.headers.authorization;
    if (authHeaders == null)
        res.status(400).send({ error: "authentication missing" });
    const accessToken = authHeaders.split(" ")[1];
    if (accessToken == null)
        res.status(400).send({ error: "authentication missing" });
    try {
        const user = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.body.userID = user._id;
        next();
    }
    catch (err) {
        res.status(400).send({ error: "fail validating token" });
    }
});
module.exports = { login, register, middleware };
//# sourceMappingURL=userController.js.map