var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors({
  origin: true,
  credentials: true,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
}))

// app.use(function(req, res, next) {
//   console.log(req.header('origin'))
//   res.setHeader('Access-Control-Allow-Origin', req.header('Origin') || '*');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//   res.setHeader('Access-Control-Expose-Headers', 'Content-Length');
//   res.setHeader('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
//   if (req.method === 'OPTIONS') {
//     return res.send(200);
//   } else {
//     return next();
//   }
// });
  
app.get('/', function (req, res) {
   res.send('Hello World');
})

app.use('/@steedos-widgets/amis-object', express.static(__dirname))


var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})