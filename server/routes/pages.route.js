import express from "express";
import cors from "cors";
import { test } from "../controllers/pages.controller.js";

const router = express.Router();

//middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.get("/", test);

export default router;
