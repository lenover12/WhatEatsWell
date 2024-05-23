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

async function searchAndDisplayProducts(searchTerm) {
  try {
    const response = await axios.get(
      //TODO: find the search parameter API endpoint for OFF
      `https://world.openfoodfacts.net/api/v2/search/${searchTerm}.json`,
      {
        timeout: 30000,
      }
    );

    // Get the current users added foods array
    //TODO: create this method in user model/controller?
    //TODO: work out session data that holds user reference, import user
    //TODO: create this array of user food IDs
    const userFoodIds = await UserModel.getUserFoods(user);

    // Format the response to local database standard
    for (item in response.data) {
      var objectId = formatId(item._id);
      var product = formatResponse(item, objectId);
      // Check if this product exists in the user's database for the current user
      // TODO: have current users session and ID
      // TODO: connect to the users database and check the foods objects array
      // TODO: rather, we pull all the users food ID's (retreive all their account info) and have that stored in the session to be used now.
      // var foodExists = false;
      for (foodId in userFoodIds) {
        if ((objectId = foodId)) {
          // foodExists = true;
          product.userOwns = true;
        }
      }
      item = product;
    }
    return response.data;
  } catch (error) {
    console.error("Error searching product by barcode:", error);
    throw error;
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

  // const paddedId = externalId.padStart(24, "0");
  // const _id = ObjectId.createFromHexString(paddedId);

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

export { searchAndUpdateProductByBarcode };
