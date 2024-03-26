import express from "express";
import AccountsCtrl from "./accounts.controller.js";

const router = express.Router();

// routing for GET requests to /api/v1/accounts endpoing
router.route("/").get(AccountsCtrl.apiGetAccounts);

export default router;
