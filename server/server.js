import express from "express";
import cors from "cors";
import users from "./routes/users.route.js";
import products from "./routes/products.route.js";
import pagesRoutes from "./routes/pages.route.js";
import cookieParser from "cookie-parser";

//Create express application
const app = express();

//Enable cross-origin resource sharing
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

//Allow reading JSON and URL-encoded requests
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//Routing
//pages
app.use("/", pagesRoutes);
//API Routing
// users
app.use("/api/v1/users", users);
// Product
app.use("/api/v1/products", products);
// Wildcard route handler
app.use("*", (req, res) =>
  res.status(404).json({ error: "Incorrect Route End" })
);

export default app;
