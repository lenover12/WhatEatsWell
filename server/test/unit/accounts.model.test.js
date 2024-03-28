import test from "ava";
import request from "supertest";
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from "../../server.js";
import Account from "../../models/accounts.js"; // Import the Account model

let mongod;

test.before(async () => {
  // Start MongoDB Memory Server
  mongod = await MongoMemoryServer.create();

  // Get the URI for the in-memory MongoDB instance
  const uri = mongod.getUri();

  // Connect to the MongoDB instance
  await mongoose.connect(uri);

  // Insert test data into the 'accounts' collection
  await Account.insertMany([
    {
      _id: "65fe85e8d32123cf23323877",
      given_name: "Leonard",
      family_name: "McDonald",
      username: "leo12",
      password: "pass12",
      premium: false
    },
    {
      _id: "6600fc77625eb7abf58c8f65",
      given_name: "Jordan",
      family_name: "Tuna",
      username: "jord10",
      password: "pass10",
      premium: true
    }
  ]);
});

test.after.always(async () => {
  // Close the MongoDB connection and stop the server
  await mongoose.disconnect();
  await mongod.stop();
});

test("Retrieve list of accounts", async (t) => {
  // send a GET request to the api/v1/accounts API endpoint
  const response = await request(app).get("/api/v1/accounts");

  // assert a 200 response
  t.is(response.status, 200);

  // console.log(response.body);

  // assert the body response contains an array of accounts
  t.true(Array.isArray(response.body.accounts));
  t.is(response.body.accounts.length, 2); // Check if the correct number of accounts is retrieved
});

test("Retrieve list of accounts with filters", async (t) => {
  // Send a GET request to the api/v1/accounts API endpoint with filters
  const response = await request(app).get("/api/v1/accounts").query({ given_name: "Leonard" });

  // Assert a 200 response
  t.is(response.status, 200);

  // Assert the body response contains an array of accounts
  t.true(Array.isArray(response.body.accounts));
  t.is(response.body.accounts.length, 1); // Check if only one account is retrieved

  // Assert the retrieved account matches the filter
  t.is(response.body.accounts[0].given_name, "Leonard");
});

test("Invalid query parameters are removed", async (t) => {
  const response = await request(app).get("/api/v1/accounts?invalid_filter=test");

  // Assert that the response status is 200 OK
  t.is(response.status, 200);

  // Assert that the 'invalid_filter' query parameter is not present in req.query
  t.falsy(response.body.invalid_filter);
});