var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express()

app.use(cors({
  origin: true,
  credentials: true,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
}))
  
app.get('/', function (req, res) {
   res.send('Hello World');
})

app.use('/@steedos-widgets', express.static(path.join(__dirname, 'packages')));

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("unpkg server listening at http://%s:%s", host, port)
})