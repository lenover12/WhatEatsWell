import axios from "axios";
import Product from "../models/products.model.js";
import UserModel from "../models/users.model.js";
import { ObjectId } from "mongodb";

async function searchAndUpdateProductByBarcode(barcode) {
  try {
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
    const existingProduct = await Product.findById(objectId);
    if (existingProduct) {
      // Update existing product
      await Product.findByIdAndUpdate(objectId, product.toObject());
      console.log(`Updated existing product with _id: ${objectId}`);
    } else {
      // Save the product into the database
      await product.save();
      console.log(`Saved new product with _id: ${objectId}`);
    }

    return product;
  } catch (error) {
    console.error("Error searching product by barcode:", error);
    throw error;
  }
}

// TODO: import userId to pull users foods from database
async function searchAndDisplayProducts(searchTerm) {
  try {
    // // Fetch user's data from the database
    // const userData = await UserModel.findById(userId);

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
      // // Check if this product exists in the current users food array
      // if (userData.foods.includes(objectId)) {
      //   product.userOwns = true;
      // }
      response.data.products[index] = product;
    });

    return response.data;
  } catch (error) {
    console.error("Error searching product by barcode:", error);
    throw error;
  }
}

// Add food to user foods array in database
async function addCurrentProductToDatabase(req, res) {
  try {
    // Extract product data
    const { productId } = req.body;

    // Check if product exists in the database
    const existingProduct = await Product.findById(productId);

    // Save or update existing product
    if (existingProduct) {
      await Product.findByIdAndUpdate(productId, req.body);
      console.log(`Updated existing product with _id: ${productId}`);
    } else {
      const newProduct = new Product(req.body);
      await newProduct.save();
      console.log(`Saved new product with _id: ${productId}`);
    }

    //TODO: user food array implementation
    // // Get the user ID from the request (you need to implement this part)
    // const userId = req.user.id;

    // // Update user's foods array with product ID
    // await User.findByIdAndUpdate(
    //   userId,
    //   { $addToSet: { foods: productId } }, // Use $addToSet to prevent duplicate entries
    //   { new: true }
    // );

    return res.status(200).json({
      message: `Product updated/saved and added to user successfully`,
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
