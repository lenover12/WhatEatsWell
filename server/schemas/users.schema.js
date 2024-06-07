import mongoose from "mongoose";

const { Schema } = mongoose;

//Define the schema for the users collection in the accounts database
const usersSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    given_name: { type: String },
    family_name: { type: String },
    DOB: { type: Date },
    premium: { type: Boolean, default: false },
    //Array of references sharing foods (products, wholefoods) _id
    foods: {
      products: [
        {
          added_at: { type: Date, default: Date.now },
          in_list: {
            type: String,
            enum: [
              "snack",
              "dinner",
              "breakfast",
              "lunch",
              "dessert",
              "meal_prep",
              "favourite",
            ],
          },
          my_serving_size: { type: Number },
        },
      ],
      wholefoods: [
        {
          added_at: { type: Date, default: Date.now },
          in_list: {
            type: String,
            enum: [
              "snack",
              "dinner",
              "breakfast",
              "lunch",
              "dessert",
              "meal_prep",
              "favourite",
            ],
          },
        },
      ],
    },
    weight: { type: Number },
    height: { type: Number },
    carbohydrates_serving_size: { type: Number },
  },
  { collection: "users" }
);

export default usersSchema;
