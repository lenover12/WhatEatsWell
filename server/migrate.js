import mongoose from 'mongoose';
import accountsSchema from './schema/accounts.schema.js';
import foodsSchema from './schema/foods.schema.js';
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ACCOUNTS_DB_URI);

    // Register schemas
    mongoose.model('Account', accountsSchema);
    mongoose.model('Food', foodsSchema);

    console.log('Migration completed.');
  } catch (error) {
    console.error('Error migrating:', error);
  } finally {
    // Close the connection after registering schemas
    mongoose.connection.close();
  }
}

// Execute migration
migrate();
