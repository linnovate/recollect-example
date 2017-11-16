var path = require('path')
var express = require('express')
var webpack = require('webpack')
var request = require('request');
var config = require('./webpack.config.dev')

var app = express()
var compiler = webpack(config)

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  })
)

app.use(require('webpack-hot-middleware')(compiler))

app.post('/send', function (req, res) {
  var objReq = {
    uri: process.env.RECOLLECT_API,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    form: req.body,
  };

  request(objReq, function (error, response, body) {
    if (!error && response.statusCode === 200 && response.body.length) {
      return res.send(body);
    }
    res.status(500).send(error || body);
  });
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3030, function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:3030')
})