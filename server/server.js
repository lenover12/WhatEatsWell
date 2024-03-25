// Node.js as the runtime environment and ES Modules for module management
import express from "express";
import cors from "cors";
import accounts from "./api/accounts.route.js";

const app = express();

app.use(cors());
// allows application to read JSON requests
app.use(express.json());

app.use("/api/v1/accounts", accounts);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
