import express from "express";
import {
  addProductByBarcode,
  searchAndDisplayProducts,
  addProductBySelection,
  getUserProductDetails,
} from "../controllers/products.controller.js";

const router = express.Router();

// Search a product by its barcode value
// Add result to products in foods database
// Add result to current user.foods array in accounts database
router.post("/barcode/:barcode", async (req, res, next) => {
  try {
    await addProductByBarcode(req, res);
  } catch (error) {
    next(error);
  }
});

// Search products and display them
router.get("/search", async (req, res, next) => {
  try {
    const { query } = req.query;
    const products = await searchAndDisplayProducts(query, req, res);
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

router.post("/add", addProductBySelection);

export default router;
