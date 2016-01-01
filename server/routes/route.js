/**
 * Created by micha on 9/7/2015.
 */
'use strict';

var express = require('express');
var router = express.Router();
var prtg = require('../controllers/prtg');
var particle = require('../controllers/particle');
var database = require('../controllers/database');

//todo delete this after extracting all our database method into the database js file
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/NodeTutorial'); // pool of 5 connection default
var db = mongoose.connection;


//intialize
database.initializeServices(db, mongoose);

//todo delete this after extracting all our database method into the database js file
require('../models/member');
var MemberModel = mongoose.model('MemberModel');

var passport = require('../config/authentication.js')(router);

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


//router.use(isAuthenticated);

//Frontend routes ==============================================================================================
var rootDirectoryPath = {root: __dirname + '/../../'};

/* GET home page. */
router.get('/', function (request, response) {
    response.sendFile('/public/views/index.html', rootDirectoryPath);
    //C:\Users\micha\Documents\git\HomeAutomatonDashboard\public\views\index.html
});

router.get('/metro', function (request, response) {
    response.sendFile('public/metro.html', rootDirectoryPath);
});
router.get('/flexmetro', function (request, response) {
    response.sendFile('public/flexmetro.html', rootDirectoryPath);
});

// LIST DIRECTIVE DATABASE TESTING ////////////////////////////////////////////////////////////////

router.get('/list/',passport.ensureAuthenticated, function (request, response) {

    MemberModel.findOne({username: request.user.username}, function (err, member) {

        var serviceType = member.serviceType;

        var list = [];
        //console.log(database);

        console.error(err);
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

router.get('/listView/', passport.ensureAuthenticated, function (request, response) {

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

router.post('/forgot', function (req, res) {
    var email = req.body.email;
    database.generateResetPasswordToken(email, req, res);
});

router.get('/reset/:token', function (req, res) {
    database.validateResetToken(req,res);
});



router.post('/reset', function (req, res) {
    database.resetPassword(req, res);
});


router.post('/createAccount', function (req, res) {
    database.createAccount(req, res);
});


router.post('/api/updateService', function (req, res) {
    database.updateService(req, res);
});


router.post('/api/hideService', function (req, res) {
    database.hideServices(req, res);
});

router.post('/api/deleteService', function (req, res) {
    database.deleteService(req, res);
});

//Not found ROUTING ===========================================================================================

//if url query doesn't match any previous router.get then it will go here and redirect to main page
router.get('/*', function (req, res) {
    //console.error(req.session.token);
    res.sendFile('/public/views/index.html', rootDirectoryPath);
});

module.exports = router;