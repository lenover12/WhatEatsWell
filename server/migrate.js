import mongoose from 'mongoose';
import accountsSchema from './schema/accounts.schema.js';
import { productsSchema, wholefoodsSchema } from './schema/foods.schema.js';
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

console.log('URI:', process.env.ACCOUNTS_DB_URI);
await mongoose.connect(process.env.ACCOUNTS_DB_URI);


async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ACCOUNTS_DB_URI);

    // Register schemas
    mongoose.model('Account', accountsSchema);
    mongoose.model('Product', productsSchema);
    mongoose.model('Wholefood', wholefoodsSchema);

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
