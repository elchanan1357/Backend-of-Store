import express from "express";
const router = express.Router();

import FavoritesCart = require("../controller/favorites_cart_controller");

router.get("/favorites", FavoritesCart.getAllFavorites);
router.post("/addFavorite", FavoritesCart.addToFavorites);
router.post("/removeFromFavorite",FavoritesCart.removeFavorite)

router.get("/cart", FavoritesCart.getAllCart);
router.post("/addToCart", FavoritesCart.addToCart);
router.post("/removeFromCart", FavoritesCart.removeFromCart);

export = router;
