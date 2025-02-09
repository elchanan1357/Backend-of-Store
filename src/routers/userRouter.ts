import express from "express";
const router = express.Router();

import User from "../controller/userController"

router.post("/register" , User.userRegister);
router.post("/login",User.userLogin);

router.post("/getUser")
router.post("/addUser")


export = router;