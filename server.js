'use strict';
const express = require('express');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const fs = require('fs');
const port = 3000;
const hostname = 'localhost';
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const passAuthentication = (username, password) => {
  let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'))['clients'];
  let user = users.find(function (user) { return user.fname === username
    && user.phone_number === password; });
    return user !== undefined;
};

const getExpressApplication = (application) => {

  application.use(bodyParser.json());
  application.get('/some/path', function(req, res) {
    res.json({ custom: 'response' });
  });

  application.get('/get_users', function(req, res) {
        if(process.env.REACT_APP_TEST === 'true') {
      fs.readFile('./users.json', 'utf8', function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data));
      });
    }
    else{
      res.json({'1':1})
    }
  });
  application.get('/get_users', function(req, res) {
    if(process.env.REACT_APP_TEST === 'true') {
      fs.readFile('./users.json', 'utf8', function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data));
      });
    }
    else{
      res.json({'1':1})
    }
  });

  application.post('/get_token', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let username = req.body['username'];
    let password = req.body['password'];
    if (passAuthentication(username, password)){
        let token = jwt.sign({ body: req.body}, 'shhhhh');
        let decoded = jwt.verify(token, 'shhhhh');
        res.send(JSON.stringify({ token: token}));
      }
    else {
    res.send(401, JSON.stringify({ 'status': 'wrong credentials'}));
    }
  });

  application.post('/authenticate', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let token = req.body['token'];
    let decoded = jwt.verify(token, 'shhhhh')['body'];
    let username = decoded['username'];
    let password = decoded['password'];
    if (passAuthentication(username, password)){
        res.send(JSON.stringify({ 'status': 'approved'}));
      }
    else {
    res.send(401, JSON.stringify({ 'status': 'not permitted'}));
    }
  });

  return application;

};

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  setup: function (app){
    getExpressApplication(app);
  }
}).listen(port, hostname, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at ' + hostname + ':' + port);
});
