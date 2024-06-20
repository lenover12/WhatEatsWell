import test from "ava";
import axios from "axios";
import mongoose from "mongoose";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import ProductsModel from "../../models/products.model.js";
import UserModel from "../../models/users.model.js";

// Mock data
const sampleProductData = {
  _id: "000000000009310072030821",
  product_name: "Sample Product",
  image_thumb_url: "http://example.com/image.jpg",
  obsolete_since_date: null,
  product_quantity: 100,
  product_quantity_unit: "g",
  product_information: {
    stores_tags: ["store1", "store2"],
    nova_group: 1,
    nova_groups_markers: {
      1: [{ type: "marker1", value: "value1" }],
      2: [{ type: "marker2", value: "value2" }],
      3: [{ type: "marker3", value: "value3" }],
      4: [{ type: "marker4", value: "value4" }],
    },
    nutrition_grades_tags: ["A"],
    food_groups_tags: ["group1"],
    packaging_recycling_tags: ["recycling1"],
    brands: "Brand1",
    categories_tags: ["category1"],
    countries_tags: ["country1"],
    manufacturing_places_tags: ["place1"],
    nutrition_data_per: "100g",
    nutrition_data_prepared_per: "serving",
  },
  nutriments: {
    carbohydrates: 0.5,
    carbohydrates_100g: 0.5,
    carbohydrates_modifier: "<",
    carbohydrates_serving: 0.29,
    carbohydrates_unit: "g",
    carbohydrates_value: 0.5,
    proteins: 13,
    proteins_100g: 13,
    proteins_serving: 7.54,
    proteins_unit: "g",
    proteins_value: 13,
    sodium: 0.13,
    sodium_100g: 0.13,
    sodium_serving: 0.0754,
    sodium_unit: "g",
    sodium_value: 0.13,
  },
  allergens_tags: ["allergen1", "allergen2"],
  traces_tags: ["trace1", "trace2"],
  unknown_ingredients_n: 0,
  vitamins_tags: ["vitamin1", "vitamin2"],
  states_tags: ["state1", "state2"],
  ingredients_tags: ["ingredient1", "ingredient2"],
  ingredients_analysis_tags: ["analysis1", "analysis2"],
};

const sampleUserFoods = {
  products: [
    {
      _id: new mongoose.Types.ObjectId("000000000009310072030821"),
      added_at: new Date(),
      in_list: "snack",
      my_serving_size: 50,
    },
  ],
  wholefoods: [],
};

// Mock user data
const mockUser = { id: "user_id" };

// Utility: mockGetUserFromToken - Mock function for tests
const mockGetUserFromToken = (token) => {
  if (!token) {
    throw new Error("Unauthorized");
  }
  return mockUser;
};

// Tests for fetchOFFProductByBarcode
test.serial(
  "fetchOFFProductByBarcode returns product data on success",
  async (t) => {
    // Mock the axios.get method to return sampleProductData
    sinon.stub(axios, "get").resolves({ data: { product: sampleProductData } });

    const result = await ProductsModel.fetchOFFProductByBarcode(
      "9310072030821"
    );

    t.deepEqual(result, sampleProductData);

    sinon.restore();
  }
);

// Tests for fetchOFFProductByBarcode returning no product data
test.serial("fetchOFFProductByBarcode handles no product data", async (t) => {
  sinon.stub(axios, "get").resolves({ data: {} });

  const result = await ProductsModel.fetchOFFProductByBarcode("9310072030821");

  t.deepEqual(result, {});

  sinon.restore();
});

// Tests for fetchOFFProductByBarcode handle API rate limit error
test.serial(
  "fetchOFFProductByBarcode handles API rate limit error",
  async (t) => {
    sinon.stub(axios, "get").rejects({ response: { status: 500 } });

    await t.throwsAsync(
      () => ProductsModel.fetchOFFProductByBarcode("9310072030821"),
      {
        instanceOf: Error,
        message: "OpenFoodFacts API rate limit reached",
      }
    );

    sinon.restore();
  }
);

// Tests for displayProductByBarcode handles generic thrown error
test.serial(
  "displayProductByBarcode handles generic thrown error",
  async (t) => {
    sinon.stub(jwt, "verify").callsFake(mockGetUserFromToken);

    // Mock UserModel.getUserFoods to return a fixed set of data
    sinon.stub(UserModel, "getUserFoods").resolves(sampleUserFoods);

    sinon.stub(axios, "get").rejects(new Error("Generic error"));

    await t.throwsAsync(
      () =>
        ProductsModel.displayProductByBarcode("9310072030821", {
          cookies: { token: "sample_token" },
        }),
      {
        instanceOf: Error,
        message: "Error displaying product by barcode: Generic error",
      }
    );

    sinon.restore();
  }
);

// Tests for displayProductByBarcode handles rate limit error
test.serial("displayProductByBarcode handles rate limit error", async (t) => {
  sinon.restore();
  // Mock the axios.get method to throw an error with a specific message
  sinon.stub(jwt, "verify").callsFake(mockGetUserFromToken);

  // Mock UserModel.getUserFoods to return a fixed set of data
  sinon.stub(UserModel, "getUserFoods").resolves(sampleUserFoods);

  // Mock avios.get to simulate API rate limit error
  sinon
    .stub(axios, "get")
    .rejects(new Error("OpenFoodFacts API rate limit reached"));

  const result = await ProductsModel.displayProductByBarcode("9310072030821", {
    cookies: { token: "sample_token" },
  });

  t.deepEqual(result, {
    products: [],
    error: "Rate limit reached. Please try again later.",
  });

  sinon.restore();
});
