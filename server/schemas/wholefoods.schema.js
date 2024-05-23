import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema for the wholefoods collection
// schema mimicks FatSecret API
const wholefoodsSchema = new Schema(
  {
    // Product barcode used in OpenFoodFacts database
    // Or a unique id from FatSecret API for non packaged foods
    //TODO:
    // _id: { type: Schema.Types.ObjectId, required: true, unique: true }, //food:food_id
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
      serving: [
        {
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
        },
      ],
    },
  },
  { collection: "wholefoods" }
);

export default wholefoodsSchema;
