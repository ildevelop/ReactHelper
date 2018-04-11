'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let mongo = require('mongodb');
const MainServer = require('./MainServer.js');
// Incert One to DB
let MongoClient = mongo.MongoClient;
const config = require('../../webpack.config');
let url = 'mongodb://localhost:27017/test12';
const port = 3000;
const hostname = '192.168.0.102';
const telagramBotApi = require('../../ApiBot/TelegramApi');

/*
 * Initialization server with botApi
 */
let telegramApi = new telagramBotApi();
telegramApi.init();

let mainServer = new MainServer();

const passAuthentication = (username, password) => {
  return mainServer.authenticate(username, password);
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
        try {
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        } catch (e) {
          console.log(e)
        }

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
        try {
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        } catch (e) {
          console.log(e)
        }

      });
    }
    else {
      response.json({'2': 2})
    }
  });
  application.get('/get_process_image/*', function (request, response) {
    let imageId = request.params[0];
    if (imageId.length === 24) {
      MongoClient.connect(url, function (err, db) {
        db.collection('process_images.chunks').find(
          {'files_id': new mongo.ObjectID(imageId)}).toArray(function (err, results) {
          if(results.length>0){
            response.setHeader('content-type', results[0].data._bsontype);
            let chunks = null;
            for (let result of results) {
              if (chunks === null) {
                chunks = result.data.buffer;
              }
              else {
                chunks += result.data.buffer
              }
            }
            response.send(chunks);
          }else  response.send(null);
        });
      });
    } else response.send(null);
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
        try {
          collection.insertOne(client, function (err, res) {
            if (err) throw err;
            response.send({status: "Success"});
            db.close();
          })
        } catch (e) {
          console.log(e)
        }
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
        } catch (e) {
          console.log(e)
        }
      });
    }
    else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }
  });
  application.post('/send_message', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    let message = req.body['message'];
    if (message) {
      let processId = null;
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to DB established!');
        var collection = db.collection('process');
        try {
          collection.insertOne(message, function (err, res) {
            if (err) throw err;
            processId = res.ops[0]._id;
            db.close();
            let msg = '';
            let fields = [
              'id: ' + processId,
              'CLIENT: ' + message.client.fname + ' ' + message.client.sname,
              '  city:' + message.client.city,
              'PROBLEM:' + message.problem,
            ];
            //проходимся по массиву и склеиваем все в одну строку
            fields.forEach(field => {
              msg += field + '\n'
            });
            if (processId) {
              let msg2 = '';
              let fields2 = [
                'CLIENT: ' + message.client.fname + ' ' + message.client.sname + ' ',
                '  city:' + message.client.city,
                '  zip:' + message.client.zipp,
                '  address:' + message.client.address,
                '  Phone:' + message.client.phone_number,
                'PROBLEM:' + message.problem,
              ];
              fields2.forEach(field => {
                msg2 += field + '\n'
              });
              for (let i in message.partner) {
                if (message.partner[i].chatId) {
                  telegramApi.messageToPartners(message.partner[i].chatId, msg, msg2, processId);
                }
              }
            }
          })
        } catch (e) {
          console.log(e)
        }
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
    console.log('processServer:', process);
    if (process) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to process collection established!');
        var collection = db.collection('process');
        try {
          collection.deleteOne({"_id": new mongo.ObjectID(process._id)}, function (err, res) {
            if (err) throw err;
            // response.send({status: "Success"});
            db.close();
          })
        } catch (e) {
          console.log(e)
        }
      });
    } else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }
    response.send({status: "Success"});
  });
  application.post('/delete_done_process', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    var done_process = req.body['done_process'];
    console.log("DONE processID", done_process);
    if (done_process) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('Connected to Done process collection established!');
        var collection = db.collection('done_process');
        try {
          collection.deleteOne({"_id": new mongo.ObjectID(done_process._id)}, function (err, res) {
            if (err) throw err;
            // response.send({status: "Success"});
            db.close();
          })
        } catch (e) {
          console.log(e)
        }
      });
    } else {
      response.send(401, JSON.stringify({'status': 'wrong Partners!!'}));
    }
    response.send({status: "Success"});
  });
  application.post('/done_process', function (req, response) {
    response.setHeader('Content-Type', 'application/json');
    let done_process = req.body['done_pr'];
    console.log('done_process:', done_process);
    if (done_process) {
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
        } catch (e) {
          console.log(e)
        }
      });
    } else {
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
        try {
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        } catch (e) {
          console.log(e)
        }
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
        try {
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        } catch (e) {
          console.log(e)
        }
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
        try {
          collection.find().toArray(function (err, res) {
            if (err) throw err;
            response.json(res);
            db.close();
          })
        } catch (e) {
          console.log(e)
        }
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
