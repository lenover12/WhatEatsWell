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
    //Array of references to Food documents
    food: [{ type: Schema.Types.ObjectId, ref: "foods" }],
    weight: { type: Number },
    height: { type: Number },
    carbohydrates_serving_size: { type: Number },
  },
  { collection: "users" }
);

export default usersSchema;
