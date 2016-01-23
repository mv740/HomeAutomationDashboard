/**
 * Created by micha on 9/7/2015.
 */
'use strict';

var express = require('express');
var router = express.Router();
var database = require('../controllers/database');

//todo delete this after extracting all our database method into the database js file
var mongoose = require('mongoose');


//intialize
database.initializeServices();

//todo delete this after extracting all our database method into the database js file
require('../models/member');
var MemberModel = mongoose.model('MemberModel');

var passport = require('../config/authentication.js')(router);

router.post('/login', function (req, res, next) {
    passport.authentication(req, res, next);
});

router.get('/logout', function (req, res) {
    if(req.user !== undefined){
        console.log("LOGGING OUT - user : " + req.user.username);
    }
    req.logout();
    req.session.destroy(function (err) {
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

router.get('/list/', passport.ensureAuthenticated, function (request, response) {
    MemberModel.findOne({username: request.user.username}, function (err, member) {
        var list = [];
        member.ServiceSetting.forEach(function (ServiceSetting) {
                var serviceType = ServiceSetting.serviceType;
                ServiceSetting.service.forEach(function (service) {
                    var object;
                    object = {
                        "serviceType": serviceType,
                        "serviceName": service.serviceName,
                        "editMode": false,
                        "serviceHide": service.serviceHide
                    };
                    list.push(object);
                });
            }
        );
        return response.send(list);
    }).lean();
});

router.get('/listView/', passport.ensureAuthenticated, function (request, response) {

    MemberModel.findOne({username: request.user.username}, function (err, member) {
        var list = [];
        member.ServiceSetting.forEach(function (ServiceSetting) {
                var serviceType = ServiceSetting.serviceType;
                ServiceSetting.service.forEach(function (service) {
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
                });
            }
        );
        return response.send(list);
    }).lean();
});

router.get('/api/list/serviceType', database.getServiceTypes);

// password reset =======================================================================================

router.post('/forgot', database.generateResetPasswordToken);
router.get('/reset/:token', database.validateResetToken);
router.post('/reset', database.resetPassword);

// Account ================================================================================================

router.post('/account', database.createAccount);

//todo
router.put('/account', function (req, res) {
   res.end();
});


//SERVICE ===================================================================================================
router.post('/api/service', passport.ensureAuthenticated, database.createService);
router.put('/api/service', passport.ensureAuthenticated, database.updateService);
router.delete('/api/service', passport.ensureAuthenticated, database.deleteService);
router.put('/api/service/hide', passport.ensureAuthenticated, database.hideServices);

//Not found ROUTING ===========================================================================================

//if url query doesn't match any previous router.get then it will go here and redirect to main page
router.get('/*', function (req, res) {
    //console.error(req.session.token);
    res.sendFile('/public/views/index.html', rootDirectoryPath);
});

module.exports = router;