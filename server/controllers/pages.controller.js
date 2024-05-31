import UsersModel from "../models/users.model.js";
import { hashPassword, comparePassword } from "../helpers/auth.helper.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const test = (req, res) => {
  res.json("test response data");
};

//Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if username was entered
    if (!username) {
      return res.json({
        error: "username is required",
      });
    }
    // Check password limit
    if (!password || password.length < 6) {
      return res.json({
        error: "Pasword is required and should be above 6 characters",
      });
    }

    // Check email
    const exist = await UsersModel.findUserByEmail({ email });
    if (exist) {
      return res.json({
        error: "Email is taken",
      });
    }

    const hashedPassword = await hashPassword(password);
    // Create user in the database
    const user = await UsersModel.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UsersModel.findUserByEmail({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    // Check password
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      res.json("passwords do not match");
    }
  } catch (error) {
    console.log(error);
  }
};

//Logout Endpoint
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

export { test, registerUser, loginUser, logoutUser, getProfile };
