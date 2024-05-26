import app from "./server.js";
import dotenv from "dotenv";
import { connectDB } from "./connections/database.js";

dotenv.config();

//Establish connection to database,
async function connectDatabases() {
  try {
    await connectDB();
    startServer();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

//Start the web server
function startServer() {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

connectDatabases();
