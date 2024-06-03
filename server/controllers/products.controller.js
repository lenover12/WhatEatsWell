import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Product from "../models/products.model.js";
import UserModel from "../models/users.model.js";
import { ObjectId } from "mongodb";

dotenv.config();

async function searchAndUpdateProductByBarcode(req, res) {
  try {
    const { barcode } = req.params;

    const response = await axios.get(
      `https://world.openfoodfacts.net/api/v2/product/${barcode}.json`,
      {
        timeout: 30000,
      }
    );

    // Format the response to local database standard
    const objectId = formatId(response.data.product._id);
    const product = formatResponse(response.data.product, objectId);

    // Check if the product already exists in the database
    let existingProduct = await Product.findById(objectId);
    if (existingProduct) {
      // Update existing product
      await Product.findByIdAndUpdate(objectId, product.toObject());
      console.log(`Updated existing product with _id: ${objectId}`);
    } else {
      // Save the product into the database
      existingProduct = await product.save();
      console.log(`Saved new product with _id: ${objectId}`);
    }

    // Get the user ID from the JWT token in the request cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Update user's food array with product ID
    await UserModel.addProductToUserFoods(user.id, objectId);

    return res.status(200).json({
      message: "Product updated/saved and added to user successfully",
      product: existingProduct,
    });
  } catch (error) {
    console.error("Error searching product by barcode:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function searchAndDisplayProducts(searchTerm) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.net/cgi/search.pl?&search_terms=${searchTerm}&json=1`,
      {
        timeout: 30000,
      }
    );

    // Format the response to local database standard
    response.data.products.forEach((productData, index) => {
      const objectId = formatId(productData._id);
      const product = formatResponse(productData, objectId);
      response.data.products[index] = product;
    });

    return response.data;
  } catch (error) {
    console.error("Error searching product by barcode:", error);
    throw error;
  }
}

async function addCurrentProductToDatabase(req, res) {
  try {
    // Extract product data from request body
    const { productId, ...productData } = req.body;

    // Check if product exists in the database
    let existingProduct = await Product.findById(productId);

    // Save or update existing product
    if (existingProduct) {
      await Product.findByIdAndUpdate(productId, productData);
      console.log(`Updated existing product with _id: ${productId}`);
    } else {
      const newProduct = new Product({ _id: productId, ...productData });
      existingProduct = await newProduct.save();
      console.log(`Saved new product with _id: ${productId}`);
    }

    // Get the user ID from the JWT token in the request cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Update user's food array with product ID
    await UserModel.addProductToUserFoods(user.id, productId);

    return res.status(200).json({
      message: "Product updated/saved and added to user successfully",
    });
  } catch (error) {
    console.error("Error updating or saving product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function formatId(_id) {
  const paddedId = _id.padStart(24, "0");
  const objectId = ObjectId.createFromHexString(paddedId);
  return objectId;
}

function formatResponse(responseProduct, paddedId) {
  // Deconstruct and extract relevant data
  const productInfo = responseProduct;
  const {
    product_name,
    image_thumb_url,
    obsolete_since_date,
    product_quantity,
    product_quantity_unit,
    product_information,
    nutriments,
    allergens_tags,
    traces_tags,
    unknown_ingredients_n,
    vitamins_tags,
    states_tags,
    ingredients_tags,
    ingredients_analysis_tags,
  } = productInfo;

  // Create a new product object including the formatted Id
  const product = new Product({
    _id: paddedId,
    food_name: product_name,
    image_url: image_thumb_url,
    obsolete_since_date,
    product_quantity,
    product_quantity_unit,
    product_information,
    nutriments,
    allergens_tags,
    traces_tags,
    unknown_ingredients_n,
    vitamins_tags,
    states_tags,
    ingredients_tags,
    ingredients_analysis_tags,
  });

  return product;
}

export {
  searchAndUpdateProductByBarcode,
  searchAndDisplayProducts,
  addCurrentProductToDatabase,
};
