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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
let user = {
    name: "eli",
    phone: 55244484,
    email: "eli@gmail.com",
    password: "eli255",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({});
    console.log("start");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({});
    mongoose_1.default.connection.close();
    console.log("finish");
}));
describe("Test of authentication of user", () => {
    test("user register", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default).post("/user/register").send(user);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(user.name);
        expect(res.body.phone).toEqual(user.phone);
        expect(res.body.email).toEqual(user.email);
        const isMatch = yield bcrypt_1.default.compare(user.password, res.body.password);
        expect(isMatch).toBe(true);
    }));
    test("Fail in user register", () => __awaiter(void 0, void 0, void 0, function* () {
        // user.phone = null
        // const res = await request(app).post("/user/register").send(user);
        // expect(res.status).not.toEqual(200);
    }));
    test("user login", () => __awaiter(void 0, void 0, void 0, function* () {
        // const res = request(app).post("/user/login").send(user);
        // expect(res.status).toEqual(200)
    }));
});
//# sourceMappingURL=testCRUD.test.js.map