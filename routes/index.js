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


// AUTHENTICATION -------------------------------------------------------------

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

var isAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated())
        res.redirect("/login");
    else
        next();
};

router.get('/hello', isAuthenticated, function (req, res) {
    console.log(req.user.username);
    res.send('look at me!');
});

router.get('/hello', function (req, res) {
    console.log(req.flash('error'));
    res.sendFile('public/loginPage.html', {root: __dirname + '/../'});
});

//router.use(isAuthenticated);

router.get('/test', function (req, res) {
    console.log(req.flash('error'));
    res.sendFile('public/loginPage.html', {root: __dirname + '/../'});
});
/////////////////////////////////////////////////////////////////////////////

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

router.get('/api/list/',isAuthenticated, function (request, response) {

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

router.get('/api/listView/',isAuthenticated, function (request, response) {

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

// ////////////////////////////////////////////////////////////////


//API ROUTING ////////////////////////////////////////////////////////////////

router.get('/api/sensorDetails/:id', function (request, response) {
    var id = request.params.id;
    prtg.getSensorDetails(id, function (value) {
        response.send(value);
    });

});
router.get('/api/loggedUsers/:id', function (request, response) {
    var id = request.params.id;
    prtg.getLoggedUsers(id, function (value) {
        response.send(value);
    });
});
router.get('/api/systemStatus', function (request, response) {
    prtg.getSystemStatus(function (value) {
        response.send(value);
    });
});
router.get('/api/device/:tag', function (request, response) {
    var tag = request.params.tag;
    prtg.getDevice(tag, function (value) {
        response.send(value);
    });
});
router.get('/api/memory/:id', function (request, response) {
    var id = request.params.id;
    prtg.getMemory(id, function (value) {
        response.send(value);
    });
});
router.get('/api/cpu/:id', function (request, response) {
    var id = request.params.id;
    prtg.getCPU(id, function (value) {
        response.send(value);
    });
});
router.get('/api/disk/:id', function (request, response) {
    var id = request.params.id;
    prtg.getDisk(id, function (value) {
        response.send(value);
    });
});

router.get('/api/logs/', function (request, response) {
    //?limit=number&maxLength=number
    var limit = request.query.limit;
    var msgLength = request.query.msgLength;
    prtg.getLogs(limit, msgLength, function (value) {
        response.send(value);
    });
});
router.get('/api/groupDevices/:groupID', function (request, response) {
    var groupID = request.params.groupID;
    prtg.getGroupDevices(groupID, function (value) {
        response.send(value);
    });
});
router.get('/api/upTime/:id', function (request, response) {
    var id = request.params.id;
    prtg.getUpTime(id, function (value) {
        response.send(value);
    });
});
router.get('/api/ping/:id', function (request, response) {
    var id = request.params.id;
    prtg.getPing(id, function (value) {
        response.send(value);
    });
});
router.get('/api/customSensor/:tag', function (request, response) {
    var tag = request.params.tag;

    prtg.getCustomSensor(tag, function (value) {
        response.send(value);
    });


});
router.get('/api/graph/:id/:hide?', function (request, response) {
    var id = request.params.id;
    var hide = request.params.hide;
    prtg.getGraph(id, hide, function (value) {
        response.send(value);
    });
});


// particle
router.get('/api/particle/:tag', function (request, response) {
    var tag = request.params.tag;
    particle.getDevice(tag, function (value) {
        response.send(value);
    });
});
router.get('/api/particle/temperature/:tag', function (request, response) {
    var tag = request.params.tag;
    particle.getTemperature(tag, function (value) {
        response.send(value);
    });
});

//if url query doesn't match any previous router.get then it will go here and redirect to main page
router.get('*', function (req, res) {
    res.redirect('/')
});
module.exports = router;