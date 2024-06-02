import express from "express";
import {
  searchAndUpdateProductByBarcode,
  searchAndDisplayProducts,
  addCurrentProductToDatabase,
} from "../controllers/products.controller.js";

const router = express.Router();

// Search a product by its barcode value
// Add result to products in food database
// Add result to current user.food array in accounts database
router.post("/search/:barcode", async (req, res, next) => {
  try {
    await searchAndUpdateProductByBarcode(req, res);
  } catch (error) {
    next(error);
  }
});

// Search products and display them
router.get("/search", async (req, res, next) => {
  const { query } = req.query;
  try {
    const products = await searchAndDisplayProducts(query);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.post("/add", addCurrentProductToDatabase);

export default router;
