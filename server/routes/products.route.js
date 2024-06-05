import express from "express";
import {
  searchAndUpdateProductByBarcode,
  searchAndDisplayProducts,
  addCurrentProductToDatabase,
  getUserProductDetails,
} from "../controllers/products.controller.js";

const router = express.Router();

// Search a product by its barcode value
// Add result to products in foods database
// Add result to current user.foods array in accounts database
router.post("/barcode/:barcode", async (req, res, next) => {
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

// Get the current user's product details
router.get("/user-product-details", async (req, res, next) => {
  try {
    await getUserProductDetails(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/add", addCurrentProductToDatabase);

export default router;
