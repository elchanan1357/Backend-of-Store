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
const name = "eli";
const phone = 55244484;
const email = "eli@gmail.com";
const password = "eli255";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({});
    console.log("start");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({});
    mongoose_1.default.connection.close();
    console.log("finish");
}));
describe("Test of user crud", () => {
    test("test of add post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default).
            post("/user/addUser").
            send({
            name: name,
            phone: phone,
            email: email,
            password: password
        });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(name);
        expect(res.body.phone).toEqual(phone);
        expect(res.body.email).toEqual(email);
        expect(res.body.password).toEqual(password);
    }));
    test("test of fail in add post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default).
            post("/user/addUser").
            send({
            name: name,
            email: email,
            password: password
        });
        expect(res.status).not.toEqual(200);
    }));
    test(("test of get post by email"), () => __awaiter(void 0, void 0, void 0, function* () {
    }));
});
//# sourceMappingURL=testCRUD.test.js.map