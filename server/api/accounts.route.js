import express from "express";
import AccountsCtrl from "./accounts.controller.js";

const router = express.Router();

// Routing for GET requests to /api/v1/accounts endpoint
router.route("/").get(AccountsCtrl.apiGetAccounts);

export default router;
