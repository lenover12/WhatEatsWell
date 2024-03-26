import AccountsDAO from "../dao/accountsDAO.js"

/**
 * controller class for handling account-related API requests.
 */

export default class AccountsController {
  // handler for API endpoint to retrieve accounts
  static async apiGetAccounts(req, res, next) {
    // pagenation parametres
    const accountsPerPage = req.query.accountsPerPage ? parseInt(req.query.accountsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    // filters based on request query parameters
    let filters = {}
    if (req.query.given_name) {
      filters.given_name = req.query.given_name;
    } else if (req.query._id) {
      filters._id = req.query._id;
    } else if (req.query.username) {
      filters.username = req.query.username;
    }

    // call DAO to retrieve accounts based on filters and pagenation
    const { accountsList, totalNumAccounts } = await AccountsDAO.getAccounts({
      filters,
      page,
      accountsPerPage,
    })

    // prepare response
    let response = {
      accounts : accountsList,
      page: page,
      filters: filters,
      entries_per_page: accountsPerPage,
      total_results: totalNumAccounts,
    }
      // return JSON response
      res.json(response)
  }

}