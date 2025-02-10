"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = __importDefault(require("../controller/userController"));
const userCRUD_1 = __importDefault(require("../controller/userCRUD"));
router.post("/register", userController_1.default.register);
router.post("/login", userController_1.default.login);
router.post("/addUser", userCRUD_1.default.addUser);
router.post("/getUser", userCRUD_1.default.getUserByEmail);
module.exports = router;
//# sourceMappingURL=userRouter.js.map