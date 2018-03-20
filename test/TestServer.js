import 'babel-polyfill';
import MainServer from '../src/backend/MainServer.js';
import assert from 'assert';

let server = new MainServer();

describe('TestMainServer() in backend/server.js with all functionality', function() {

  beforeEach(function() {
    server = new MainServer();
  });

  afterEach(function() {
    // runs after each test in this block
  });

  it('passAuthentication(username, password) with true credentials', function() {
    let isAuthenticated = server.authenticate('ilya@gmail.com', 'test');
    assert.equal(isAuthenticated, true);
  });
  // test cases
});