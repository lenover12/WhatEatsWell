import ProductsModel from "../models/products.model.js";
import UserModel from "../models/users.model.js";
import { getUserFromToken } from "../utils/auth.js";

async function searchAndDisplayProducts(req, res) {
  try {
    const { query: searchTerm } = req.query;

    // Check if the searchTerm is a barcode
    const isBarcode = /^\d+$/.test(searchTerm.trim());

    let productData;

    if (
      isBarcode &&
      searchTerm.trim().length >= 8 &&
      searchTerm.trim().length <= 14
    ) {
      productData = await ProductsModel.displayProductByBarcode(
        searchTerm,
        req
      );
    } else {
      productData = await ProductsModel.displayProductsBySearchTerm(
        searchTerm,
        req
      );
    }

    // // any errors that slipped through propagation
    // if (productData.error) {
    //   throw productData.error;
    // }

    if (Object.keys(productData).length === 0) {
      throw new Error("Products not found in OpenFoodFacts database");
    }

    // Successful response
    return res.status(200).json(productData);
  } catch (error) {
    // Centralized error handling
    if (error.message === "Authorization token is missing") {
      return res.status(401).json({
        error: error.message,
        products: [],
      });
    }

    if (error.message === "Products not found in OpenFoodFacts database") {
      return res.status(404).json({
        error: error.message,
        products: [],
      });
    }

    if (error.message === "OpenFoodFacts API rate limit reached") {
      return res.status(429).json({
        error: error.message,
        products: [],
      });
    }

    // Generic internal server error handler
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
      products: [],
    });
  }
}

// Add product by barcode to the database and user
async function addProductByBarcode(req, res) {
  try {
    const { barcode } = req.params;
    // Retrieve product data from OpenFoodFacts API endpoint
    const productData = await ProductsModel.fetchOFFProductByBarcode(barcode);
    // Format and insert the response into the local database standard
    const product = ProductsModel.formatProductData(productData);
    await ProductsModel.InsertToProductsDB(product);

    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);
    await ProductsModel.InsertToUsersDB(user, product);

    return res.status(200).json({
      message: "Product updated/saved and added to user successfully",
    });
  } catch (error) {
    console.error("Error searching and inserting product by barcode:", error);
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
    const product = new ProductsModel({ _id: productId, ...productData });
    await ProductsModel.InsertToProductsDB(product);

    // Get the user ID from the JWT token in the request cookies
    const user = getUserFromToken(req);

    //
    await ProductsModel.InsertToUsersDB(user, product);

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
    const products = await ProductsModel.find({
      _id: { $in: productIds },
    }).lean();

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

// // converts a string into a 24 character ObjectId
// function formatId(_id) {
//   const paddedId = _id.padStart(24, "0");
//   const objectId = ObjectId.createFromHexString(paddedId);
//   return objectId;
// }

export {
  addProductByBarcode,
  searchAndDisplayProducts,
  addProductBySelection,
  getUserProductDetails,
};
