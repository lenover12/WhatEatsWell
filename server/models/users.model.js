import mongoose from "mongoose";
import usersSchema from "../schemas/users.schema.js";

//Use correct database from the database connection
const database = mongoose.connection.useDb("accounts");
const Users = database.model("Users", usersSchema);

//Define methods
//Export the model
const UsersModel = {
  //Retreive all users' information by filter and pagenation
  async getUsers({ filters, page, usersPerPage }) {
    const query = {};
    //Apply filters (if any)
    if (filters) {
      if (filters.given_name) {
        query.given_name = filters.given_name;
      } else if (filters._id) {
        query._id = filters._id;
      } else if (filters.username) {
        query.username = filters.username;
      }
    }
    //Calculate skip count based on pagination
    const skip = page * usersPerPage;
    //Retrieve users based on query and pagination
    try {
      const usersList = await Users.find(query)
        //Exclude password data
        .select("-password")
        .skip(skip)
        .limit(usersPerPage)
        .exec();
      const totalNumUsers = await Users.countDocuments(query);
      return { usersList, totalNumUsers };
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  },

  //Retrieve all user usernames
  async getAllUsernames() {
    try {
      const usernames = await Users.find({}, { username: 1 });
      return usernames.map((user) => user.username);
    } catch (error) {
      throw new Error(`Error retrieving usernames: ${error.message}`);
    }
  },

  async findUserByEmail(query) {
    try {
      const user = await Users.findOne(query);
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  },

  async createUser(userData) {
    try {
      const newUser = await Users.create(userData);
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  /**
   * Add product information to the user's foods.products array
   * @param {String} userId - The user's ID
   * @param {Object} productInfo - The product information to add
   */
  async addProductToUserFoods(userId, productInfo) {
    try {
      const user = await Users.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if the product with the same _id already exists in the array
      const existingProduct = user.foods.products.find((product) =>
        product._id.equals(productInfo._id)
      );
      if (existingProduct) {
        // Product with the same _id already exists, do not add it again
        console.log("user already follows this food");
        return user;
      }

      // Add the product to the array
      user.foods.products.push(productInfo);
      await user.save();
      return user;
    } catch (error) {
      throw new Error(
        `Error adding product to user's foods.products array: ${error.message}`
      );
    }
  },

  /**
   * Add wholefood information to the user's foods.wolefoods array
   * @param {String} userId - The user's ID
   * @param {Object} wholefoodInfo - The wholefood information to add
   */
  async addWholefoodToUserFoods(userId, wholefoodInfo) {
    try {
      // Use $addToSet to prevent duplicate entries
      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { $addToSet: { "foods.wholefoods": wholefoodInfo } },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new Error(
        `Error adding product to user's foods.wholefoods array: ${error.message}`
      );
    }
  },

  async getUserFoods(userId) {
    try {
      const user = await Users.findById(userId)
        .populate("foods.products")
        .populate("foods.wholefoods");
      if (!user) {
        throw new Error("User not found");
      }
      return user.foods;
    } catch (error) {
      throw new Error(`Error retrieving user's foods: ${error.message}`);
    }
  },
};

export default UsersModel;
