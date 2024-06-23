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

    t.teardown(() => sinon.restore());

    const result = await ProductsModel.fetchOFFProductByBarcode(
      "9310072030821"
    );

    t.deepEqual(result, sampleProductData);
  }
);

// Tests for fetchOFFProductByBarcode returning no product data
test.serial("fetchOFFProductByBarcode handles no product data", async (t) => {
  sinon.stub(axios, "get").resolves({ data: {} });

  t.teardown(() => sinon.restore());

  const error = await t.throwsAsync(() =>
    ProductsModel.fetchOFFProductByBarcode("9310072030821")
  );

  t.is(error.message, "Products not found in OpenFoodFacts database");
});

// Tests for fetchOFFProductByBarcode handle API rate limit error
test.serial(
  "fetchOFFProductByBarcode handles API rate limit error",
  async (t) => {
    sinon.stub(axios, "get").rejects({ response: { status: 500 } });

    t.teardown(() => sinon.restore());

    const error = await t.throwsAsync(() =>
      ProductsModel.fetchOFFProductByBarcode("9310072030821")
    );

    t.is(error.message, "OpenFoodFacts API rate limit reached");
  }
);

test.serial(
  "displayProductByBarcode throws error when barcode is missing",
  async (t) => {
    sinon.stub(jwt, "verify").callsFake(mockGetUserFromToken);

    t.teardown(() => sinon.restore());

    const req = { cookies: { token: "sample_token" } };

    const error = await t.throwsAsync(() =>
      ProductsModel.displayProductByBarcode(null, req)
    );

    t.is(error.message, "Barcode is required");
  }
);

test.serial(
  "displayProductByBarcode throws error when authorization token is missing",
  async (t) => {
    const req = { cookies: {} };

    const error = await t.throwsAsync(() =>
      ProductsModel.displayProductByBarcode("9310072030821", req)
    );

    t.is(error.message, "Authorization token is missing");
  }
);

test.serial(
  "displayProductByBarcode throws error when user authentication is invalid",
  async (t) => {
    sinon.stub(jwt, "verify").callsFake(() => null);

    t.teardown(() => sinon.restore());

    const req = { cookies: { token: "sample_token" } };

    const error = await t.throwsAsync(() =>
      ProductsModel.displayProductByBarcode("9310072030821", req)
    );

    t.is(error.message, "Invalid user authentication");
  }
);

test.serial("displayProductByBarcode fetches user foods", async (t) => {
  sinon.stub(jwt, "verify").callsFake(mockGetUserFromToken);
  // Mock UserModel.getUserFoods to return a fixed set of data
  sinon.stub(UserModel, "getUserFoods").resolves(sampleUserFoods);

  // Set the user
  const user = mockUser;

  sinon
    .stub(ProductsModel, "fetchOFFProductByBarcode")
    .resolves(sampleProductData);

  t.teardown(() => sinon.restore());

  const req = { cookies: { token: "sample_token" } };

  await ProductsModel.displayProductByBarcode("9310072030821", req);

  t.true(UserModel.getUserFoods.calledWith(user.id));
});

test.serial(
  "displayProductByBarcode throws error when product not found",
  async (t) => {
    sinon.stub(jwt, "verify").callsFake(mockGetUserFromToken);
    // Mock UserModel.getUserFoods to return a fixed set of data
    sinon.stub(UserModel, "getUserFoods").resolves(sampleUserFoods);
    sinon.stub(ProductsModel, "fetchOFFProductByBarcode").resolves({});

    t.teardown(() => sinon.restore());

    const error = await t.throwsAsync(() =>
      ProductsModel.displayProductByBarcode("9310072030821", {
        cookies: { token: "sample_token" },
      })
    );

    t.is(error.message, "Products not found in OpenFoodFacts database");
  }
);

test.serial(
  "displayProductByBarcode returns formatted product data",
  async (t) => {
    const formattedProduct = {
      _id: "000000000009310072030821",
      toObject: () => ({ _id: "000000000009310072030821" }),
    };

    sinon.stub(jwt, "verify").callsFake(mockGetUserFromToken);
    sinon.stub(UserModel, "getUserFoods").resolves(sampleUserFoods);
    sinon
      .stub(ProductsModel, "fetchOFFProductByBarcode")
      .resolves(sampleProductData);
    sinon.stub(ProductsModel, "formatProductData").returns(formattedProduct);

    t.teardown(() => sinon.restore());

    const req = { cookies: { token: "sample_token" } };

    const result = await ProductsModel.displayProductByBarcode(
      "9310072030821",
      req
    );

    t.deepEqual(result, {
      products: [
        {
          _id: "000000000009310072030821",
          user_information: {
            added_at: sampleUserFoods.products[0].added_at,
            in_list: "snack",
            my_serving_size: 50,
          },
        },
      ],
    });
  }
);
