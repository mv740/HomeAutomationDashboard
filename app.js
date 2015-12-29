/**
 * Created by micha on 8/25/2015.
 */

// modules ============================================================
var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var options = {
    key: fs.readFileSync('certificate/server.key.pem'),
    cert: fs.readFileSync('certificate/server.crt'),
    passphrase: '1q2w'
};
var routes = require('./routes/route');
var prtg = require('./routes/prtg');
var particle = require('./routes/particle');

// configuration ======================================================
// set the static files location
app.use('/public', express.static(
    __dirname + '/public',
    {
        extensions: ['html']
    }));
app.use('/api',prtg);
app.use('/api/particle',particle);
app.use('/', routes);

//start app ===========================================================

//ssl secured server (HTTPS)
https.createServer(options, app).listen(3000, function () {
    console.log('Started!');
});
// HTTP server
//app.listen(process.env.PORT || 8080);
