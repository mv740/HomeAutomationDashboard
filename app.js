/**
 * Created by micha on 8/25/2015.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var options = {
    key  : fs.readFileSync('certificate/server.key.pem'),
    cert : fs.readFileSync('certificate/server.crt'),
    passphrase: '1q2w'
};



var routes = require('./routes/index');

//needle = request http
var needle = require('needle');
var prtg = require('./prtg');


// New call to compress content
app.use('/public', express.static(__dirname + '/public', {
    extensions : ['html']
}));
//app.use('/node_modules', express.static(__dirname + '/node_modules'));


app.use('/', routes);

//ssl secured server (HTTPS)
https.createServer(options, app).listen(3000, function () {
    console.log('Started!');
});
// HTTP server
//app.listen(process.env.PORT || 8080);
