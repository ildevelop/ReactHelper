'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const fs = require('fs');
const port = 3000;
const hostname = 'localhost';
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var person = require('./person.json');
var mongo = require('mongodb');

// Incert One to DB
var MongoClient = mongo.MongoClient;
var url = 'mongodb://localhost:27017/test12';
var users = [];
var resDB = {'21':21};

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log('Connected established!');
//   var dbo = db.db("test12");
//
//   var collection = dbo.collection('person');
//   collection.insertMany(person, function(err, result) {
//     if (err) {console.log('OOPS something wrong',err); return}
//     users = result.ops;
//     console.log('Count ===> ',result.insertedCount);
//     console.log('Count ===> ',result.ops);
//     db.close();
//   });
// });




const passAuthentication = (username, password) => {
  let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'))['permission'];
  let user = users.find(function (user) { return user.email === username
    && user.password === password; });
    return user !== undefined;
};

const getExpressApplication = (application) => {
  application.use(bodyParser.json());
  application.get('/some/path', function(req, res) {
    res.json({ custom: 'response' });
  });

  application.get('/get_clients', function(req, response) {
    if(process.env.REACT_APP_TEST === 'true') {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('clients');
        collection.find().toArray(function (err, res) {
          if (err) throw err;
          response.json(res);
          db.close();
        })
      });
    }
    else{
      res.json({'1':1})
    }
  });
  application.get('/get_partners', function(req, response) {
    if(process.env.REACT_APP_TEST === 'true') {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('partners');
        collection.find().toArray(function (err, res) {
          if (err) throw err;
          response.json(res);
          db.close();
        })
      });
    }
    else{
      res.json({'2':2})
    }
  });

  application.post('/add_client', function(req, response) {
    response.setHeader('Content-Type', 'application/json');
    let client = req.body['clients'];
    console.log(client);
    if (client){

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('clients');
        collection.insertOne(client,function (err, res) {
          if (err) throw err;
          response.send({status: "Success"});
          db.close();
        })
      });

    }
    else {
      res.send(401, JSON.stringify({ 'status': 'wrong Clients!!'}));
    }
  });
  application.post('/add_partners', function(req, response) {
    response.setHeader('Content-Type', 'application/json');
    let partners = req.body['partners'];
    console.log(partners);
    if (partners){

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('partners');
        collection.insertOne(partners,function (err, res) {
          if (err) throw err;
          response.send({status: "Success"});
          db.close();
        })
      });

    }
    else {
      res.send(401, JSON.stringify({ 'status': 'wrong Partners!!'}));
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
    res.send(401, JSON.stringify({ 'status': 'wrong credentials!!'}));
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
