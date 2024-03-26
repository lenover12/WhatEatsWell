import { ObjectId } from "mongodb";

// store a reference to the database
let accounts;

export default class accountsDAO {
  static async injectDB(conn) {
    if (accounts) {
      return
    }
    try {
      accounts = await conn.db(process.env.ACCOUNTS_NS).collection("users");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in accountsDAO: ${e}`,
      )
    }
  }

  static async getAccounts({
    filters = null,
    page = 0,
    accountsPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("given_name" in filters) {
        query = { $text: { $search: filters["given_name"] } }
      } else if ("_id" in filters) {
        try {
          query = { "_id": ObjectId.createFromHexString(filters["_id"]) };
        } catch (error) {
          console.error(`Error converting _id to ObjectId: ${error}`);
        }
      } else if ("username" in filters) {
        query = { "username": { $eq: filters["username"] } }
      }
    }

    let cursor

    try {
      cursor = await accounts
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { accountsList: [], totalNumAccounts: 0 }
    }

    const displayCursor = cursor.limit(accountsPerPage).skip(accountsPerPage * page)

    try{
      const accountsList = await displayCursor.toArray()
      const totalNumAccounts = await accounts.countDocuments(query)
      return {accountsList, totalNumAccounts}
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { accountsList: [], totalNumAccounts: 0}
    }
  }
}