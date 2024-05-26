import mongoose from "mongoose";
import productsSchema from "../schemas/products.schema.js";

//Use correct database from the database connection
const database = mongoose.connection.useDb("foods");
const Products = database.model("Products", productsSchema);

Products.getProducts = async function ({ filters, page, foodsPerPage }) {
  const query = {};

  // Apply filters if present
  if (filters) {
    if (filters.food_name) {
      query.food_name = filters.food_name;
    }
  }

  // Calculate skip count based on pagination
  const skip = page * foodsPerPage;

  // Retrieve foods based on query and pagination
  const productsList = await this.find(query)
    .skip(skip)
    .limit(foodsPerPage)
    .exec();

  // Count total number of foods based on query
  const totalNumProducts = await this.countDocuments(query);

  return { productsList, totalNumProducts };
};

export default Products;
