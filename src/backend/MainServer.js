'use strict';
// import fs from 'fs';
const fs = require('fs');
const util = require('util');
// import util from 'util';
const USERS_LOCATION_FILE = util.format('%s/%s', __dirname, '../../test/users.json');

class MainServer {

  authenticate(username, password){
    let users = this.getUsers();
    let user = users.find(function (user) {
      return user.email === username
        && user.password === password;
    });
    return user !== undefined;
  }

  getUsers() {
    return JSON.parse(fs.readFileSync(USERS_LOCATION_FILE, 'utf8'))['permission'];
  }
}

module.exports = MainServer;
