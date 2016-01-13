/**
 * Created by micha on 8/25/2015.
 */
'use strict';
// modules ============================================================
var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var options = {
    pfx: fs.readFileSync('server/config/certificate/keyStore.pfx'),
    passphrase: '1q2w'
};
var favicon = require('serve-favicon');
var routes = require('./server/routes/route');
var prtg = require('./server/routes/prtg');
var particle = require('./server/routes/particle');
var mongoose = require('mongoose');
var config = require('./server/config/config');

// configuration ======================================================

//database setup

mongoose.connect(config.db.development); // pool of 5 connection default

app.use(favicon(__dirname + '/public/favicon.ico'));

// set the static files location
app.use('/public', express.static(
    __dirname + '/public',
    {
        extensions: ['html']
    }));

//set routes folders
app.use('/api', prtg);
app.use('/api/particle', particle);
app.use('/', routes);

//start app ===========================================================

//ssl secured server (HTTPS)
https.createServer(options, app).listen(3000, function () {
    console.log('HTTPS Server Started!');
});
// HTTP server
//app.listen(process.env.PORT || 8080);
