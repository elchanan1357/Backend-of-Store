import express from "express";
const router = express.Router();

import middleware from "../middleware/token";

import FavoritesCart = require("../controller/favorites_cart_controller");

router.get(
  "/favorites",
  middleware.middlewareInCookie,
  FavoritesCart.getAllFavorites
);
router.post(
  "/addFavorite",
  middleware.middlewareInCookie,
  FavoritesCart.addToFavorites
);
router.post(
  "/removeFromFavorite",
  middleware.middlewareInCookie,
  FavoritesCart.removeFavorite
);

router.get("/cart", middleware.middlewareInCookie, FavoritesCart.getAllCart);
router.post(
  "/addToCart",
  middleware.middlewareInCookie,
  FavoritesCart.addToCart
);
router.post(
  "/removeFromCart",
  middleware.middlewareInCookie,
  FavoritesCart.removeFromCart
);

export = router;
