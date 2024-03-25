// Node.js as the runtime environment and ES Modules for module management
import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.ACCOUNTS_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  wtimeout: 2500,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async () => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
