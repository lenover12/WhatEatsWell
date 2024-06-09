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
router.post("/barcode/:barcode", addProductByBarcode);

// Search products and display them
router.get("/search", searchAndDisplayProducts);

// Get the current user's product details
router.get("/user-product-details", getUserProductDetails);

// Add product by selection
router.post("/add", addProductBySelection);

export default router;
