import express from "express";
const router = express.Router();

import UserAuth from "../controller/authentication";

router.post("/register", UserAuth.register);
router.post("/login", UserAuth.login);
router.get("/logout", UserAuth.logout);////add middleware

export = router;
