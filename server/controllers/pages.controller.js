import UsersModel from "../models/users.model.js";
import { hashPassword, comparePassword } from "../helpers/auth.helper.js";

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
      res.json("passwords match");
    }
    if (!match) {
      res.json("passwords do not match");
    }
  } catch (error) {
    console.log(error);
  }
};

export { test, registerUser, loginUser };
