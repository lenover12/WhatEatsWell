import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Product from "../models/products.model.js";
import UserModel from "../models/users.model.js";
import { ObjectId } from "mongodb";
import { getUserFromToken } from "../utils/auth.js";

dotenv.config();

// Fetch product by barcode from OpenFoodFacts
async function fetchOFFProductByBarcode(barcode) {
  const response = await axios.get(
    `https://world.openfoodfacts.net/api/v2/product/${barcode}.json`,
    {
      timeout: 30000,
    }
  );
  return response.data.product;
}

// Fetch products by search term from OpenFoodFacts
async function fetchOFFProductsBySearch(searchTerm) {
  const response = await axios.get(
    `https://world.openfoodfacts.net/cgi/search.pl?&search_terms=${searchTerm}&json=1`,
    {
      timeout: 30000,
    }
  );
  return response;
}

// Insert product to database, updating if it already exists
async function InsertToProductsDB(product) {
  const existingProduct = await Product.findById(product._id);
  if (existingProduct) {
    await Product.findByIdAndUpdate(product._id, product.toObject());
    console.log(`Updated existing product with _id: ${product._id}`);
  } else {
    await product.save();
    console.log(`Saved new product with _id: ${product._id}`);
  }
}

// Insert product to user's list of foods
async function InsertToUsersDB(user, product) {
  const userProducts = await UserModel.getUserFoods(user.id);
  // Check if product is already added to the user's foods
  if (!userProducts.products.some((up) => up._id.equals(product._id))) {
    await UserModel.addProductToUserFoods(user.id, {
      _id: product._id,
      added_at: new Date(),
    });
  }
}

// Format product data to match the database schema
function formatProductData(responseProduct) {
  const paddedId = formatId(responseProduct._id);
  const product = new Product({
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
}

//TODO: create displayProductByBarcode
//
async function displayProductByBarcode(barcode, req) {
  try {
    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);

    // Fetch user-specific foods from the database
    const userFoods = await UserModel.getUserFoods(user.id);

    // Create a map of user foods for quick lookup
    const userProductsMap = new Map(
      userFoods.products.map((product) => [product._id.toString(), product])
    );

    // Fetch product data from OpenFoodFacts API endpoint
    const productData = await fetchOFFProductByBarcode(barcode);
    if (!productData) {
      return { products: [] }; // Handle product not found scenario
    }

    // Format the product data from the external API
    const product = formatProductData(productData);

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
          ...product._doc,
          user_information: userInformation,
        },
      ],
    };
  } catch (error) {
    console.error("Error displaying product by barcode:", error);
    throw new Error(`Error displaying product by barcode: ${error.message}`);
  }
}

// Add product by barcode to the database and user
async function addProductByBarcode(req, res) {
  try {
    const { barcode } = req.params;
    // Retrieve product data from OpenFoodFacts API endpoint
    const productData = await fetchOFFProductByBarcode(barcode);
    // Format and Insert the response into  the local database standard
    const product = formatProductData(productData);
    await InsertToProductsDB(product);

    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);
    await InsertToUsersDB(user, product);

    return res.status(200).json({
      message: "Product updated/saved and added to user successfully",
    });
  } catch (error) {
    console.error("Error searching and inserting product by barcode:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function displayProductsBySearchTerm(searchTerm) {
  try {
    const response = await fetchOFFProductsBySearch(searchTerm);

    // Format the response to local database standard
    response.data.products.forEach((productData, index) => {
      const product = formatProductData(productData);
      response.data.products[index] = product;
    });

    return response.data;
  } catch (error) {
    console.error("Error searching product by search term:", error);
    throw error;
  }
}

async function searchAndDisplayProducts(searchTerm, req, res) {
  try {
    // Check if the searchTerm is a barcode
    const isBarcode = /^\d+$/.test(searchTerm.trim());
    if (
      isBarcode &&
      searchTerm.trim().length >= 8 &&
      searchTerm.trim().length <= 14
    ) {
      // Retrieve product by barcode
      const product = await displayProductByBarcode(searchTerm, req);
      if (product) {
        return res.status(200).json(product);
      } else {
        return res.status(404).send("Product not found");
      }
    } else {
      // Retrieve data by search term
      const productsData = await displayProductsBySearchTerm(searchTerm);
      return res.status(200).json(productsData);
    }
  } catch (error) {
    console.error("Error searching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// add the product into the product database and the users database
// required the product information to be in the state
async function addProductBySelection(req, res) {
  try {
    // Extract product data from request body
    const { productId, ...productData } = req.body;

    //
    const product = new Product({ _id: productId, ...productData });
    await InsertToProductsDB(product);

    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);

    //
    await InsertToUsersDB(user, product);

    return res.status(200).json({
      message: "Product updated/saved and added to user successfully",
    });
  } catch (error) {
    console.error("Error updating or saving product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserProductDetails(req, res) {
  try {
    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);
    // Retrieve user's foods
    const userFoods = await UserModel.getUserFoods(user.id);

    // Extract products list with user-specific details
    const userProducts = userFoods.products.map((product) => ({
      _id: product._id,
      added_at: product.added_at,
      in_list: product.in_list,
      my_serving_size: product.my_serving_size,
    }));

    // Fetch full product data for each product ID
    const productIds = userProducts.map((product) => product._id);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Combine user-specific information with product details
    const combinedProducts = products.map((product) => {
      const userProduct = userProducts.find((up) => up._id.equals(product._id));
      return {
        ...product,
        user_information: {
          added_at: userProduct.added_at,
          in_list: userProduct.in_list,
          my_serving_size: userProduct.my_serving_size,
        },
      };
    });

    return res.status(200).json({
      products: combinedProducts,
    });
  } catch (error) {
    console.error("Error retrieving user's product details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// converts a string into a 24 character ObjectId
function formatId(_id) {
  const paddedId = _id.padStart(24, "0");
  const objectId = ObjectId.createFromHexString(paddedId);
  return objectId;
}

export {
  addProductByBarcode,
  searchAndDisplayProducts,
  addProductBySelection,
  getUserProductDetails,
};
