import UsersModel from "../models/users.model.js";

const test = (req, res) => {
  res.json("test response data");
};

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

    const user = await UsersModel.createUser({
      username,
      email,
      password,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export { test, registerUser };
