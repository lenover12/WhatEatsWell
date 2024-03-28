import Accounts from "../models/accounts.js";

export default class AccountsController {
  static async apiGetAccounts(req, res, next) {
    const accountsPerPage = req.query.accountsPerPage ? parseInt(req.query.accountsPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.given_name) {
      filters.given_name = req.query.given_name;
    } else if (req.query._id) {
      filters._id = req.query._id;
    } else if (req.query.username) {
      filters.username = req.query.username;
    }

    try {
      const { accountsList, totalNumAccounts } = await Accounts.getAccounts({
        filters,
        page,
        accountsPerPage,
      });

      let response = {
        accounts: accountsList,
        page: page,
        filters: filters,
        entries_per_page: accountsPerPage,
        total_results: totalNumAccounts,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
