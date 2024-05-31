import express from "express";
import cors from "cors";
import {
  test,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/pages.controller.js";

const router = express.Router();

//middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", getProfile);

export default router;
