const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const fs = require('fs');

const port = 3002;
const hostname = 'localhost';

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  setup: function(app) {
    app.get('/get_users', function(req, res) {
      console.log(process.env.REACT_APP_TEST);
      if(process.env.REACT_APP_TEST === "true") {
        fs.readFile('./users.json', 'utf8', function (err, data) {
          if (err) throw err;
          res.json(JSON.parse(data));
        });
      }
      else{
        res.json({'1':1})
      }
    });
  }
}).listen(port, hostname, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at ' + hostname + ':' + port);
});
