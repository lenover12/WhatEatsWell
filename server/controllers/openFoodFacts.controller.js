import axios from "axios";
import fs from "fs";
import path from "path";

// Define your custom User-Agent
const userAgent = "WhatEatsWell/1.0 (lennymcdonald247@hotmail.com)";

// Function to search Open Food Facts API
async function searchOpenFoodFacts(query) {
  try {
    // Make a GET request to search products
    const response = await axios.get(
      `https://au.openfoodfacts.net/cgi/search.pl?search_terms=${query}&page_size=10&json=1`,
      {
        headers: {
          "User-Agent": userAgent,
        },
      }
    );

    // Extract product names from the response
    const products = response.data.products;
    const productNames = products.map((product) => product.product_name);

    return productNames;
  } catch (error) {
    console.error("Error searching Open Food Facts API:", error);
    return [];
  }
}

// Function to search product by barcode using Open Food Facts API
async function searchProductByBarcode(barcode) {
  try {
    const response = await axios.get(
      `https://au.openfoodfacts.net/api/v2/product/${barcode}.json`
    );

    // Download the thumbnail image and save it locally
    const productInfo = response.data.product;
    const thumbnailUrl = productInfo.image_thumb_url;
    const thumbnailFileName = `${barcode}.jpg`;
    await downloadThumbnail(thumbnailUrl, thumbnailFileName);

    // Save product information as JSON file
    const jsonFileName = `${barcode}.json`;
    const jsonFilePath = path.join("./thumbnails", jsonFileName);
    saveAsJson(jsonFilePath, response.data);

    return response.data;
  } catch (error) {
    console.error("Error searching product by barcode:", error);
    throw error;
  }
}

// Function to download thumbnail image
async function downloadThumbnail(url, fileName) {
  try {
    const response = await axios({
      url: url,
      method: "GET",
      responseType: "stream",
    });

    const filePath = path.join("./thumbnails", fileName);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading thumbnail:", error);
    throw error;
  }
}

// Function to save data as JSON file
function saveAsJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Data saved as JSON file: ${filePath}`);
  } catch (error) {
    console.error("Error saving data as JSON file:", error);
    throw error;
  }
}

// Example usage
(async () => {
  // const query = 'banana'; // Example search query
  // const productNames = await searchOpenFoodFacts(query);
  // const barcode = '9300633984007'
  const barcode = "9300650452701";
  const productNames = await searchProductByBarcode(barcode);
  console.log("Product Names:", productNames);
})();
