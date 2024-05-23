import express from "express";
import { searchAndUpdateProductByBarcode } from "../controllers/products.controller.js";

const router = express.Router();

router.get("/search/:barcode", async (req, res, next) => {
  const { barcode } = req.params;
  try {
    const product = await searchAndUpdateProductByBarcode(barcode);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
