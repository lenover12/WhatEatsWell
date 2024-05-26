import express from "express";
import {
  searchAndUpdateProductByBarcode,
  searchAndDisplayProducts,
  addCurrentProductToDatabase,
} from "../controllers/products.controller.js";

const router = express.Router();

// Search a product by its barcode value
// Add result to food database
//TODO: also add to current user.food array in database
router.post("/search/:barcode", async (req, res, next) => {
  const { barcode } = req.params;
  try {
    const product = await searchAndUpdateProductByBarcode(barcode);
    res.json(product);
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
