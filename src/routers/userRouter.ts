import express from "express";
const router = express.Router();

import UserAuth from "../controller/authentication"
import  Middleware  from "../middleware/token";

router.post("/register" , UserAuth.register);
router.post("/login",UserAuth.login);
router.post("/getUsers",Middleware.middleware, UserAuth.getAllData  );

export = router;