'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const fs = require('fs');
const port = 3000;
const hostname = 'localhost';
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var mongo = require('mongodb');
const configApi = require('./api/conf.json');
// Incert One to DB
var MongoClient = mongo.MongoClient;
var url = 'mongodb://localhost:27017/test12';

const passAuthentication = (username, password) => {
  let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'))['permission'];
  let user = users.find(function (user) {
    return user.email === username
      && user.password === password;
  });
  return user !== undefined;
};

const getExpressApplication = (application) => {
  application.use(bodyParser.json());
  application.get('/some/path', function (req, res) {
    res.json({custom: 'response'});
  });

  application.get('/get_clients', function (req, response) {
    if (process.env.REACT_APP_TEST === 'true') {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('clients');
        try{
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        }catch (e) {console.log(e)}

      });
    }
    else {
      response.json({'1': 1})
    }
  });
  application.get('/get_partners', function (req, response) {
    if (process.env.REACT_APP_TEST === 'true') {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('partners');
        try{
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        }catch (e){console.log(e)}

      });
    }
    else {
      response.json({'2': 2})
    }
  });

  application.post('/add_client', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    let client = req.body['clients'];
    console.log(client);
    if (client) {

      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('clients');
        try{
          collection.insertOne(client, function (err, res) {
            if (err) throw err;
            response.send({status: "Success"});
            db.close();
          })
        }catch (e){console.log(e)}
      });

    }
    else {
      response.send(401, JSON.stringify({'status': 'wrong Clients!!'}));
    }
  });
  application.post('/add_partner', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    let partners = req.body['partners'];
    if (partners) {

      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('partners');
        try {
          collection.insertOne(partners, function (err, res) {
            if (err) throw err;
            response.send({status: "Success"});
            db.close();
          })
        }catch (e){console.log(e)}

      });

    }
    else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }
  });
  application.post('/send_message', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    let message = req.body['message'];
    console.log('message', message);
    if (message) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('process');
        try {
          collection.insertOne(message, function (err, res) {
            if (err) throw err;
            // response.send({status: "Success"});
            db.close();
          })
        }catch (e){console.log(e)}

      });

      let http = require('request');
      let fields = [
        '<b>CLIENT: </b> ' + message.client.fname + ' ' + message.client.sname,
        '<b>   phone: </b> ' + message.client.phone_number,
        '<b>   city:</b> ' + message.client.city,
        '<b>   street:</b> ' + message.client.address,
        '<b>PROBLEM:</b> ' + message.problem,
        '<b>PARTNER:</b> ' + message.partner.fname + ' ' + message.partner.sname,
      ];
      let msg = '';
      //проходимся по массиву и склеиваем все в одну строку
      fields.forEach(field => {
        msg += field + '\n'
      });
      //кодируем результат в текст, понятный адресной строке
      msg = encodeURI(msg);
      http.post(`https://api.telegram.org/bot${configApi.telegram.token}/sendMessage?chat_id=${configApi.telegram.chat}&parse_mode=html&text=${msg}`, function (error, res, body) {
      });
      response.send({status: "Success"});
    }
    else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }

  });
  application.post('/delete_process', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    let process = req.body['process'];
    console.log('processServer:',process);
    if(process){
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to process collection established!');
        var collection = db.collection('process');
        try {
          collection.deleteOne( { "_id" : new mongo.ObjectID(process._id) } , function (err, res) {
            if (err) throw err;
            // response.send({status: "Success"});
            db.close();
          })
        }catch (e){console.log(e)}
      });
    }else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }
    response.send({status: "Success"});
  });
  application.post('/delete_done_process', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    var done_process = req.body['done_process'];
    console.log("DONE processID",done_process);
    if(done_process){
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to Done process collection established!');
        var collection = db.collection('done_process');
        try {
          collection.deleteOne( { "_id" : done_process._id } , function (err, res) {
            if (err) throw err;
            // response.send({status: "Success"});
            db.close();
          })
        }catch (e){console.log(e)}
      });
    }else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }
    response.send({status: "Success"});
  });
  application.post('/done_process', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    let done_process = req.body['done_pr'];
    console.log('done_process:',done_process);
    if(done_process){
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to process collection established!');
        let collection = db.collection('done_process');
        try {
          collection.insertOne(done_process, function (err, res) {
            if (err) throw err;
            // response.send({status: "Success"});
            db.close();
          })
        }catch (e){console.log(e)}
      });
    }else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }
    response.send({status: "Success"});
  });
  application.get('/get_process', function (req, response) {
    if (process.env.REACT_APP_TEST === 'true') {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to process collection established!');
        var collection = db.collection('process');
        try{
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        }catch (e){console.log(e)}
      });
    }
    else {
      response.json({'3': 3})
    }
  });
  application.get('/get_done_process', function (req, response) {
    if (process.env.REACT_APP_TEST === 'true') {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to collection done established!');
        var collection = db.collection('done_process');
        try{
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        }catch (e){console.log(e)}
      });
    }
    else {
      response.json({'4': 4})
    }
  });
  application.get('/get_categories', function (req, response) {
    if (process.env.REACT_APP_TEST === 'true') {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to collection categories established!');
        var collection = db.collection('categories');
        try{
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        }catch (e){console.log(e)}
      });
    }
    else {
      response.json({'5': 5})
    }
  });
  application.post('/get_token', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let username = req.body['username'];
    let password = req.body['password'];
    if (passAuthentication(username, password)) {
      let token = jwt.sign({body: req.body}, 'shhhhh');
      let decoded = jwt.verify(token, 'shhhhh');
      res.send(JSON.stringify({token: token}));
    }
    else {
      res.send(401, JSON.stringify({'status': 'wrong credentials!!'}));
    }
  });

  application.post('/authenticate', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let token = req.body['token'];
    let decoded = jwt.verify(token, 'shhhhh')['body'];
    let username = decoded['username'];
    let password = decoded['password'];
    if (passAuthentication(username, password)) {
      res.send(JSON.stringify({'status': 'approved'}));
    }
    else {
      res.send(401, JSON.stringify({'status': 'not permitted'}));
    }
  });

  return application;

};

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  setup: function (app) {
    getExpressApplication(app);
  }
}).listen(port, hostname, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at ' + hostname + ':' + port);
});
