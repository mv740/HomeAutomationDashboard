/**
 * Created by micha on 8/25/2015.
 */
var express = require('express');
var app = express();
var child_process = require('child_process');




var routes = require('./routes/index');

//needle = request http
var needle = require('needle');
var prtg = require('./prtg');


var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
//var url = 'mongodb://localhost:27017/NodeTutorial';
// Use connect method to connect to the Server
/*
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    var col = db.collection('Member');
    // Insert a single document

    // Get first two documents that match the query
    col.find({username:'mv740', password:'mv740'}).limit(2).toArray(function (err, docs) {
        //console.log(docs);
        console.log(docs[0].ServiceSetting[0].service[0].serviceName);
        console.log(docs[0].ServiceSetting[1].service[0].serviceName);

        db.close();
    });
});


 app.use(express.static(__dirname + '/public', {
 extensions: ['html']
 }));
 */
// New call to compress content
app.use('/public', express.static(__dirname + '/public', {
    extensions : ['html']
}));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


app.use('/', routes);


app.listen(process.env.PORT || 8080);
