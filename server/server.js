import express from "express";
import cors from "cors";
import users from "./routes/users.route.js";
import products from "./routes/products.route.js";

//Create express application
const app = express();

//Enable cross-origin resource sharing
app.use(cors());

//Allow reading JSON requests
app.use(express.json());

//Routing
// users
app.use("/api/v1/users", users);
// Product
app.use("/api/v1/products", products);
// Wildcard route handler
app.use("*", (req, res) =>
  res.status(404).json({ error: "Incorrect Route End" })
);

export default app;
