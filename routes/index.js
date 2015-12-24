/**
 * Created by micha on 9/7/2015.
 */
'use strict';

var express = require('express');
var router = express.Router();
var prtg = require('../prtg');
var particle = require('../particle');
var database = require('../database');

var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/NodeTutorial'); // pool of 5 connection default


var member = require('../models/member');
var MemberModel = mongoose.model('MemberModel');

/////////
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/////////////////////////////////////////////////////////////////////////////


passport.use('local', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {
        console.log(username + ":" + password);
        MemberModel.findOne({username: username}, function (err, user) {
            //console.log(user);
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (user.password !== password) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    MemberModel.findById(id, function (err, user) {
        done(err, user);
    });
});


router.use(flash());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secured: false}
}));
router.use(passport.initialize());
router.use(passport.session());
//////////////////////////////////////////////////
router.post('/login', passport.authenticate('local'), function (req, res) {
    //passport.authenticate('local')
    console.log(req.body);

    var auth = {
        'authentication': 'success'
    };
    res.send(auth);
});

// AUTHENTICATION -------------------------------------------------------------
router.post('/login', function (req, res, next) {
    console.log(req.body);
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.status(401).send({success: false, message: 'authentication failed'});
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send({success: true, message: 'authentication succeeded', username: req.body.username});
        });
    })(req, res, next);
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
    database.getServiceTypes(MemberModel, request, response);
});

router.post('/api/insertService', function (req, res) {
    database.insertService(MemberModel, req, res);
});

router.post('/api/createAccount', function (req, res) {
    database.createAccount(MemberModel, req, res);
});

router.post('/api/updateService', function (req, res) {
  database.updateService(MemberModel,req,res);
});


router.post('/api/hideService', function (req, res) {
    database.hideServices(MemberModel, req, res);
});

router.post('/api/deleteService', function (req, res) {
    database.deleteService(MemberModel, req, res);
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