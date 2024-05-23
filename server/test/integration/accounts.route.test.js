import test from "ava";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../server.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

test.before(async () => {
  // Define the MongoDB URI
  const mongoURI = process.env.ACCOUNTS_DB_URI;

  // Connect to MongoDB
  await mongoose.connect(mongoURI, {});
});

test.after.always(async () => {
  // Disconnect from MongoDB
  await mongoose.disconnect();
});

test("Connect to deployment database", async (t) => {
  // Send a GET request to the api/v1/users API endpoint
  const response = await request(app).get("/api/v1/users");

  // Assert a 200 response
  t.is(response.status, 200);

  // Assert the body response contains an array of users
  t.true(Array.isArray(response.body.users));
});
