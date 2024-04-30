import express from "express";
import cors from "cors";
import accounts from "./api/accounts.route.js";

// Create the express application
const app = express();

// Enable cross-origin resource sharing
// Allows requests from different origins
app.use(cors());

// Allows application to read JSON requests
app.use(express.json());

// Routing
app.use("/api/v1/accounts", accounts);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
