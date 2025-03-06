import express from "express";
const router = express.Router();

import FavoritesCart = require("../controller/favorites_cart_controller");

router.get("/favorite", FavoritesCart.getAllFavorites);
router.post("/addFavorite", FavoritesCart.addToFavorites);

router.get("/cart", FavoritesCart.getAllCart);
router.post("/addToCart", FavoritesCart.addToCart);

export = router;
