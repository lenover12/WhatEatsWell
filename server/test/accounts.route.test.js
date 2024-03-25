// test/accounts.route.test.js
import test from 'ava';
import request from 'supertest';
import app from '../server.js';

test('Accounts Route', async (t) => {
  const response = await request(app).get('/api/v1/accounts');
  t.is(response.status, 200);
  t.is(response.text, 'hello world');
});
