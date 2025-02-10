"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = __importDefault(require("../controller/authentication"));
router.post("/register", authentication_1.default.register);
router.post("/login", authentication_1.default.login);
module.exports = router;
//# sourceMappingURL=userRouter.js.map