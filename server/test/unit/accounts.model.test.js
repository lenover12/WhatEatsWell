import test from "ava";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../server.js";
import UsersModel from "../../models/users.model.js";

let mongod;

test.before(async () => {
  // Start MongoDB Memory Server
  mongod = await MongoMemoryServer.create();

  // Get the URI for the in-memory MongoDB instance
  const uri = mongod.getUri();

  // Connect to the MongoDB instance
  await mongoose.connect(uri);

  // Insert test data into the 'users' collection
  await UsersModel.insertMany([
    {
      _id: "65fe85e8d32123cf23323877",
      given_name: "Leonard",
      family_name: "McDonald",
      username: "leo12",
      password: "pass12",
      email: "leonard@example.com",
      premium: false,
      food: [],
      weight: 75,
      height: 180,
      carbohydrates_serving_size: 30,
    },
    {
      _id: "6600fc77625eb7abf58c8f65",
      given_name: "Jordan",
      family_name: "Tuna",
      username: "jord10",
      password: "pass10",
      email: "jordan@example.com",
      premium: true,
      food: [],
      weight: 65,
      height: 170,
      carbohydrates_serving_size: 25,
    },
  ]);
});

test.after.always(async () => {
  // Close the MongoDB connection and stop the server
  await mongoose.disconnect();
  await mongod.stop();
});

test("Retrieve list of users", async (t) => {
  // Send a GET request to the api/v1/users API endpoint
  const response = await request(app).get("/api/v1/users");

  // Assert a 200 response
  t.is(response.status, 200);

  // Assert the body response contains an array of users
  t.true(Array.isArray(response.body.users));
  t.is(response.body.users.length, 2); // Check if the correct number of users is retrieved
});

test("Retrieve list of users with filters", async (t) => {
  // Send a GET request to the api/v1/users API endpoint with filters
  const response = await request(app)
    .get("/api/v1/users")
    .query({ given_name: "Leonard" });

  // Assert a 200 response
  t.is(response.status, 200);

  // Assert the body response contains an array of users
  t.true(Array.isArray(response.body.users));
  t.is(response.body.users.length, 1); // Check if only one user is retrieved

  // Assert the retrieved user matches the filter
  t.is(response.body.users[0].given_name, "Leonard");
});

test("Invalid query parameters are removed", async (t) => {
  const response = await request(app).get("/api/v1/users?invalid_filter=test");

  // Assert that the response status is 200 OK
  t.is(response.status, 200);

  // Assert that the 'invalid_filter' query parameter is not present in req.query
  t.falsy(response.body.invalid_filter);
});
