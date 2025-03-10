import express from "express";
const router = express.Router();

import UserAuth from "../controller/authentication";
import middleware from "../middleware/token";

router.post("/register", UserAuth.register);
router.post("/login", UserAuth.login);
router.get("/logout", middleware.middlewareInCookie, UserAuth.logout);

export = router;
