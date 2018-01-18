const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const fs = require('fs');

const port = 3001;
const hostname = 'localhost';

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  // setup: function(app) {
    // app.get('/books', function(req, res) {
    //   fs.readFile('./books.json', 'utf8', function (err, data) {
    //     if (err) throw err;
    //     res.json(JSON.parse(data).map(function (item) {
    //       item.date = item.date - Math.random() * 31536000000;
    //       return item;
    //     }));
    //   });
    // });
  // }
}).listen(port, hostname, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at ' + hostname + ':' + port);
});
