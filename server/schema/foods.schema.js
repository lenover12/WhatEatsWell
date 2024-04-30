import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema for the products collection
// schema mimicks OpenFoodFacts
const productsSchema = new Schema(
  {
    // Product barcode used in OpenFoodFacts database
    // Or a unique id from FatSecret API for non packaged foods
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    food_name: { type: String, required: true },
    image_url: { type: String },
    obsolete_since_date: { type: String },
    product_quantity: { type: Number },
    product_quantity_unit: { type: String },
    product_information: [{
      stores_tags: { type: [String] },
      nova_group: { type: Number }, //https://world.openfoodfacts.org/nova
      nova_groups_markers: {
        type: {
          '1': [{
              type: { type: String, required: true },
              value: { type: String, required: true },
          }],
          '2': [{
              type: { type: String, required: true },
              value: { type: String, required: true },
          }],
          '3': [{
              type: { type: String, required: true },
              value: { type: String, required: true },
          }],
          '4': [{
              type: { type: String, required: true },
              value: { type: String, required: true },
          }],
        }
      },
      nutrition_grades_tags: { type: [String] },
      food_groups_tags: { type: [String] },
      packaging_recycling_tags: { type: [String] },
      brands : { type: String },
      categories_tags: { type: [String] },
      countries_tags: { type: [String] },
      manufacturing_places_tags: { type: [String] },
      nutrition_data_per: { type: String }, //'serving' or '100g'
      nutrition_data_prepared_per: { type: String },
    }],
    nutriments: { type: Schema.Types.Mixed },
    allergens_tags: { type: [String]},
    traces_tags : { type: [String] },
    unknown_ingredients_n: { type: Number },
    vitamins_tags: { type: [String] },
    //for en:ingredients-completed, en:nutrition-facts-completed etc
    states_tags: { type: [String] },
    ingredients_tags: { type: [String] },
    ingredients_analysis_tags: { type: [String] }, // weather the ingredients are compelte or not
  },
  { collection: "products" }
);
//Open Food Facts API reference
//https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#cmp--schemas-product-base
//FatSecret API reference
//https://platform.fatsecret.com/docs/guides/parameters


// Define the schema for the wholefoods collection
// schema mimicks FatSecret API
const wholefoodsSchema = new Schema(
  {
    // Product barcode used in OpenFoodFacts database
    // Or a unique id from FatSecret API for non packaged foods
    _id: { type: Schema.Types.ObjectId, required: true, unique: true }, //food:food_id
    food_name: { type: String, required: true },
    // only store first image
    image_url: { type: String }, //food_images:food_image:[0]image_url
    food_type: { type: String }, //e.g. brand, generic
    food_catagories: { type: [String] },
    food_url: { type: String }, //fatsecret url
    // only store name when value = 1 in JSON response
    allergens_tags: { type: [String] }, //food_attributes:allergens:allergen:name
    //  used for vegetarian/vegan etc, store name if value is 1
    preferences: { type: [String] }, //preferences:preference:name
    servings: {
      serving: [{
        serving_id: { type: String },
        serving_description: { type: String },
        serving_url: { type: String },
        metric_serving_amount: { type: String },
        metric_serving_unit: { type: String },
        number_of_units: { type: String },
        measurement_description: { type: String },
        is_default: { type: String },
        calories: { type: String },
        carbohydrate: { type: String },
        protein: { type: String },
        fat: { type: String },
        saturated_fat: { type: String },
        polyunsaturated_fat: { type: String },
        monounsaturated_fat: { type: String },
        trans_fat: { type: String },
        cholesterol: { type: String },
        sodium: { type: String },
        potassium: { type: String },
        fiber: { type: String },
        sugar: { type: String },
        added_sugars: { type: String },
        vitamin_d: { type: String },
        vitamin_a: { type: String },
        vitamin_c: { type: String },
        calcium: { type: String },
        iron: { type: String },
      }]
    },
  },
  { collection: "wholefoods" }
);

export { productsSchema, wholefoodsSchema};