import mongoose from "mongoose";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import productsSchema from "../schemas/products.schema.js";
import UserModel from "./users.model.js";
import { ObjectId } from "mongodb";
import { getUserFromToken } from "../utils/auth.js";

//Use correct database from the database connection
const database = mongoose.connection.useDb("foods");
const ProductModel = database.model("Products", productsSchema);

ProductModel.getProducts = async function ({ filters, page, foodsPerPage }) {
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

// Fetch product by barcode from OpenFoodFacts
ProductModel.fetchOFFProductByBarcode = async function (barcode) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.net/api/v2/product/${barcode}.json`,
      {
        timeout: 30000,
      }
    );

    if (!response.data || !response.data.product) {
      // Return an empty object if no products found
      return {};
    }

    return response.data.product;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      // Return specific error message for rate limit issues from OpenFoodFacts
      throw new Error("OpenFoodFacts API rate limit reached");
    }
    throw error;
  }
};

// Fetch products by search term from OpenFoodFacts
ProductModel.fetchOFFProductsBySearch = async function (searchTerm) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.net/cgi/search.pl?&search_terms=${searchTerm}&json=1`,
      {
        timeout: 30000,
      }
    );

    // Return an empty product list if no products found
    if (!response.data || !response.data.products) {
      return { data: { products: [] } };
    }

    return response;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      // Return specific error message for rate limit issues from OpenFoodFacts
      throw new Error("OpenFoodFacts API rate limit reached");
    }
    throw error;
  }
};

// Insert product to database, updating if it already exists
ProductModel.InsertToProductsDB = async function (product) {
  const existingProduct = await this.findById(product._id);
  if (existingProduct) {
    await this.findByIdAndUpdate(product._id, product.toObject());
    console.log(`Updated existing product with _id: ${product._id}`);
  } else {
    await product.save();
    console.log(`Saved new product with _id: ${product._id}`);
  }
};

// Insert product to user's list of foods
ProductModel.InsertToUsersDB = async function (user, product) {
  const userProducts = await UserModel.getUserFoods(user.id);
  // Check if product is already added to the user's foods
  if (!userProducts.products.some((up) => up._id.equals(product._id))) {
    await UserModel.addProductToUserFoods(user.id, {
      _id: product._id,
      added_at: new Date(),
    });
  }
};

// Format product data to match the database schema
ProductModel.formatProductData = function (responseProduct) {
  const paddedId = this.formatId(responseProduct._id);
  const product = new this({
    _id: paddedId,
    food_name: responseProduct.product_name,
    image_url: responseProduct.image_thumb_url,
    obsolete_since_date: responseProduct.obsolete_since_date,
    product_quantity: responseProduct.product_quantity,
    product_quantity_unit: responseProduct.product_quantity_unit,
    product_information: responseProduct.product_information,
    nutriments: responseProduct.nutriments,
    allergens_tags: responseProduct.allergens_tags,
    traces_tags: responseProduct.traces_tags,
    unknown_ingredients_n: responseProduct.unknown_ingredients_n,
    vitamins_tags: responseProduct.vitamins_tags,
    states_tags: responseProduct.states_tags,
    ingredients_tags: responseProduct.ingredients_tags,
    ingredients_analysis_tags: responseProduct.ingredients_analysis_tags,
  });
  return product;
};

ProductModel.displayProductByBarcode = async function (barcode, req) {
  try {
    // Ensure barcode and request are provided
    if (!barcode) {
      throw new Error("Barcode is required");
    }

    if (!req || !req.cookies || !req.cookies.token) {
      throw new Error("Authorization token is missing");
    }
    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);
    if (!user || !user.id) {
      throw new Error("Invalid user authentication");
    }
    // Fetch user-specific foods from the database
    const userFoods = await UserModel.getUserFoods(user.id);

    // Create a map of user foods for quick lookup
    const userProductsMap = new Map(
      userFoods.products.map((product) => [product._id.toString(), product])
    );

    // Fetch product data from OpenFoodFacts API endpoint
    const productData = await this.fetchOFFProductByBarcode(barcode);
    if (!productData || Object.keys(productData).length === 0) {
      throw new Error("Products not found in OpenFoodFacts database");
    }

    // Format the product data from the external API
    const product = this.formatProductData(productData);

    // Retrieve user-specific details using map lookup
    const userProduct = userProductsMap.get(product._id.toString());

    // Initialize user information object with fallback logic
    const userInformation = userProduct
      ? {
          added_at: userProduct.added_at || null,
          in_list: userProduct.in_list || null,
          my_serving_size: userProduct.my_serving_size || null,
        }
      : null;

    // Format and return the product data
    return {
      products: [
        {
          ...product.toObject(),
          user_information: userInformation,
        },
      ],
    };
  } catch (error) {
    console.error(
      `Error displaying product by barcode: ${error.response.status} ${error.response.statusText}`
    );

    return {
      products: [],
      error: error,
    };
  }
};

ProductModel.displayProductsBySearchTerm = async function (searchTerm, req) {
  try {
    // Ensure barcode and request are provided
    if (!searchTerm) {
      throw new Error("Search Term is required");
    }

    if (!req || !req.cookies || !req.cookies.token) {
      throw new Error("Authorization token is missing");
    }
    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);
    if (!user || !user.id) {
      throw new Error("Invalid user authentication");
    }

    // Fetch user-specific foods from the database
    const userFoods = await UserModel.getUserFoods(user.id);

    // Create a map of user foods for quick lookup
    const userProductsMap = new Map(
      userFoods.products.map((product) => [product._id.toString(), product])
    );

    // Fetch products data from OpenFoodFacts API endpoint
    const productsData = await this.fetchOFFProductsBySearch(searchTerm);
    if (!productsData || productsData.data.count === 0) {
      throw new Error("Products not found in OpenFoodFacts database");
    }

    // Format the productsData to local database standard
    productsData.data.products.forEach((productData, index) => {
      const product = this.formatProductData(productData);
      // Retrieve user-specific details using map lookup
      const userProduct = userProductsMap.get(product._id.toString());
      // Initialize user information object with fallback logic
      const userInformation = userProduct
        ? {
            added_at: userProduct.added_at || null,
            in_list: userProduct.in_list || null,
            my_serving_size: userProduct.my_serving_size || null,
          }
        : null;
      productsData.data.products[index] = {
        ...product.toObject(),
        user_information: userInformation,
      };
    });

    return productsData.data;
  } catch (error) {
    console.error("Error searching product by search term:", error);

    return {
      products: [],
      error: error,
    };
  }
};

// Converts a string into a 24 character ObjectId
ProductModel.formatId = function (_id) {
  const paddedId = _id.padStart(24, "0");
  const objectId = ObjectId.createFromHexString(paddedId);
  return objectId;
};

export default ProductModel;
