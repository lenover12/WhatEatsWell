import mongoose from "mongoose";
import usersSchema from "./schema/users.schema.js";
import productsSchema from "./schema/products.schema.js";
import wholefoodsSchema from "./schema/wholefoods.schema.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

console.log("URI:", process.env.BASE_DB_URI);
await mongoose.connect(process.env.BASE_DB_URI);

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.BASE_DB_URI);

    // Register schemas
    const accountsDatabase = mongoose.connection.useDb("accounts");
    accountsDatabase.model("Users", usersSchema);
    const foodsDatabase = mongoose.connection.useDb("foods");
    foodsDatabase.model("Products", productsSchema);
    foodsDatabase.model("Wholefoods", wholefoodsSchema);

    console.log("Migration completed.");
  } catch (error) {
    console.error("Error migrating:", error);
  } finally {
    // Close the connection after registering schemas
    mongoose.connection.close();
  }
}

// Execute migration
migrate();
