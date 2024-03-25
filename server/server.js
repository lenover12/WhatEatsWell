import express from "express";
import cors from "cors";
import accounts from "./api/accounts.route.js";

// create the express application
const app = express();

// enable cross-origin resource sharing
// allows requests from different origins
app.use(cors());

// allows application to read JSON requests
app.use(express.json());

// routing
app.use("/api/v1/accounts", accounts);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
