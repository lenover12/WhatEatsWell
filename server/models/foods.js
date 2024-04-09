import mongoose from "mongoose";
import foodsSchema from "../schema/foods.schema.js";

const Food = mongoose.model("Food", foodsSchema);

Food.getFoods = async function ({ filters, page, foodsPerPage }) {
  const query = {};

  // Apply filters if present
  if (filters) {
    if (filters.name) {
      query.name = filters.name;
    }
  }

  // Calculate skip count based on pagination
  const skip = page * foodsPerPage;

  // Retrieve foods based on query and pagination
  const foodsList = await this.find(query)
    .skip(skip)
    .limit(foodsPerPage)
    .exec();

  // Count total number of foods based on query
  const totalNumFoods = await this.countDocuments(query);

  return { foodsList, totalNumFoods };
};

export default Food;
