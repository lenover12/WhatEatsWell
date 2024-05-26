import mongoose from "mongoose";
import wholefoodsSchema from "../schemas/wholefoods.schema.js";

//Use correct database from the database connection
const database = mongoose.connection.useDb("foods");
const Wholefood = database.model("Wholefood", wholefoodsSchema);

Wholefood.getWholefoods = async function ({ filters, page, foodsPerPage }) {
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
  const WholefoodsList = await this.find(query)
    .skip(skip)
    .limit(foodsPerPage)
    .exec();

  // Count total number of foods based on query
  const totalNumWholefoods = await this.countDocuments(query);

  return { WholefoodsList, totalNumWholefoods };
};

export default Wholefood;
