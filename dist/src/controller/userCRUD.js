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
function sendError(res, err) {
    res.status(400).send({ error: err });
}
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find({ email: req.body.email });
        if (user == null)
            return sendError(res, "Can't find user");
        console.log("find user");
        res.status(200).send(user);
    }
    catch (err) {
        console.log("Fail in get user by email");
        sendError(res, "Fail in get user by email");
    }
});
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new userModel_1.default({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
    });
    try {
        const newUser = yield user.save();
        res.status(200).send(newUser);
    }
    catch (err) {
        console.log("Fail in add new user");
        sendError(res, "Fail in add new user");
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
module.exports = { getUserByEmail, addUser };
//# sourceMappingURL=userCRUD.js.map