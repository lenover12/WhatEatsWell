import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import AccountsDAO from "./dao/accountsDAO.js";

// load environment variables from .env file
dotenv.config();

// alias for the MongoDB client
const MongoClient = mongodb.MongoClient;

// define the port to listen on
const port = process.env.PORT || 8000;

// connect to mongoDB database
MongoClient.connect(process.env.ACCOUNTS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  wtimeout: 2500,
})
  // log connection errors and close connection
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  // start express server and listen
  .then(async (client) => {
    await AccountsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
