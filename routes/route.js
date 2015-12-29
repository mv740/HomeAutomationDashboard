/**
 * Created by micha on 9/7/2015.
 */
'use strict';

var express = require('express');
var router = express.Router();
var prtg = require('../prtg');
var particle = require('../particle');
var database = require('../database');

//todo delete this after extracting all our database method into the database js file
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/NodeTutorial'); // pool of 5 connection default
var db = mongoose.connection;


//intialize
database.initializeServices(db, mongoose);

//todo delete this after extracting all our database method into the database js file
require('../models/member');
var MemberModel = mongoose.model('MemberModel');



var passport = require('./config/authentication.js')(router);

router.post('/login', function (req, res, next) {
    passport.authentication(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        console.log("user is log out");
        res.redirect('/');
    });
});

router.get('/hello', passport.ensureAuthenticated, function (req, res) {
    console.log(req.user.username);
    res.send('look at me!');
});



//router.use(isAuthenticated);

router.get('/test', function (req, res) {
    console.log(req.flash('error'));
    res.sendFile('public/loginPage.html', {root: __dirname + '/../'});
});

//Frontend routes ==============================================================================================

/* GET home page. */
router.get('/', function (request, response) {
    response.sendFile('public/index.html', {root: __dirname + '/../'});
});

router.get('/metro', function (request, response) {
    response.sendFile('public/metro.html', {root: __dirname + '/../'});
});
router.get('/flexmetro', function (request, response) {
    response.sendFile('public/flexmetro.html', {root: __dirname + '/../'});
});

// LIST DIRECTIVE DATABASE TESTING ////////////////////////////////////////////////////////////////

router.get('/api/list/',passport.ensureAuthenticated, function (request, response) {

    MemberModel.findOne({username: request.user.username}, function (err, member) {

        //console.log(database);
        var serviceType = member.serviceType;

        var list = [];
        //console.log(database);
        member.ServiceSetting.forEach(function (ServiceSetting) {
                var serviceType = ServiceSetting.serviceType;
                ServiceSetting.service.forEach(function (service) {
                    //console.log(serviceType);
                    var object;
                    object = {
                        "serviceType": serviceType,
                        "serviceName": service.serviceName,
                        "editMode": false,
                        "serviceHide": service.serviceHide
                    };
                    list.push(object);
                })
            }
        );

        return response.send(list);
    }).lean();

});

router.get('/api/listView/', passport.ensureAuthenticated, function (request, response) {

    MemberModel.findOne({username: request.user.username}, function (err, member) {

        //console.log(database);
        var serviceType = member.serviceType;

        var list = [];
        //console.log(database);
        member.ServiceSetting.forEach(function (ServiceSetting) {
                var serviceType = ServiceSetting.serviceType;
                ServiceSetting.service.forEach(function (service) {
                    //console.log(serviceType);
                    if (!service.serviceHide) {
                        var object;
                        object = {
                            "serviceType": serviceType,
                            "serviceName": service.serviceName,
                            "editMode": false,
                            "serviceHide": service.serviceHide
                        };
                        list.push(object);
                    }
                })
            }
        );

        return response.send(list);
    }).lean();

});

router.get('/api/list/serviceType', function (request, response) {
    database.getServiceTypes(request, response);
});

router.post('/api/insertService', function (req, res) {
    database.insertService(req, res);
});

router.post('/api/createAccount', function (req, res) {
    database.createAccount(req, res);
});

router.post('/api/updateService', function (req, res) {
  database.updateService(req,res);
});


router.post('/api/hideService', function (req, res) {
    database.hideServices(req, res);
});

router.post('/api/deleteService', function (req, res) {
    database.deleteService(req, res);
});

//Not found ROUTING ===========================================================================================

//if url query doesn't match any previous router.get then it will go here and redirect to main page
router.get('*', function (req, res) {
    res.redirect('/')
});

module.exports = router;