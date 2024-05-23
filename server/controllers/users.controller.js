import UsersModel from "../models/users.model.js";

export default class UsersController {
  //Retreive all users' information by filter and pagenation
  static async apiGetFilteredUsers(req, res, next) {
    //Page limit
    const usersPerPage = req.query.usersPerPage
      ? parseInt(req.query.usersPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    //Filters
    let filters = {};
    if (req.query.given_name) {
      filters.given_name = req.query.given_name;
    } else if (req.query._id) {
      filters._id = req.query._id;
    } else if (req.query.username) {
      filters.username = req.query.username;
    }

    //Response
    try {
      const { usersList, totalNumUsers } = await UsersModel.getUsers({
        filters,
        page,
        usersPerPage,
      });

      let response = {
        users: usersList,
        page: page,
        filters: filters,
        entries_per_page: usersPerPage,
        total_results: totalNumUsers,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  //Retrieve all users usernames
  static async apiGetAllUsernames(req, res, next) {
    try {
      const usernames = await UsersModel.getAllUsernames();

      res.json(usernames);
    } catch (error) {
      next(error);
    }
  }
}
