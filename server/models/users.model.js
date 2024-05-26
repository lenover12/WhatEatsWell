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
};

export default UsersModel;
