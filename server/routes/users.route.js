import express from "express";
import UsersCtrl from "../controllers/users.controller.js";

const router = express.Router();

//GET requests to /api/v1/users endpoint
router.route("/f/").get(UsersCtrl.apiGetFilteredUsers);

router.route("/u/").get(UsersCtrl.apiGetAllUsernames);

export default router;
