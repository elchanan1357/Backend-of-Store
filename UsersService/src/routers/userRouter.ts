import express from "express";
const router = express.Router();

import UserAuth from "../controller/authentication";
import FavoritesCart = require("../controller/favorites_cart_controller");

router.post("/register", UserAuth.register);
router.post("/login", UserAuth.login);
router.get("/logout", UserAuth.logout);
router.get("/favorite",FavoritesCart.favoriteHandler)
router.get("/cart",FavoritesCart.cartHandler)

export = router;
