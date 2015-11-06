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


passport.use('local1', new LocalStrategy(
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
    cookie: {secured: true}
}));
router.use(passport.initialize());
router.use(passport.session());
//////////////////////////////////////////////////
router.post('/login', passport.authenticate('local1'), function (req, res) {
    //passport.authenticate('local')
    console.log(req.body);

    var auth = {
        'authentication' : 'success'
    };
    res.send(auth);
});



router.post('/public/LoginPage.html', function(req, res, next){
    passport.authenticate('local1', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            return res.status(401).send({ success : false, message : 'authentication failed' });
        }
        req.login(user, function(err){
            if(err){
                return next(err);
            }
            return res.send({ success : true, message : 'authentication succeeded', username: req.body.username });
        });
    })(req, res, next);
});

router.get('/public/loginPage.html', function (req, res) {
    console.log(req.flash('error'));
    var log = (req.flash('error'));

    res.sendStatus(req.flash('success', 'This is a flash message using the express-flash module.'));
});
// AUTHENTICATION -------------------------------------------------------------
router.post('/login', function(req, res, next){
    console.log(req.body);
    passport.authenticate('local1', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            return res.status(401).send({ success : false, message : 'authentication failed' });
        }
        req.login(user, function(err){
            if(err){
                return next(err);
            }
            return res.send({ success : true, message : 'authentication succeeded', username: req.body.username });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
});

var isAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated())
        res.redirect("/public/loginPage.html");
    else
        next();
};

router.get('/hello', isAuthenticated, function (req, res) {
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

router.get('/api/list/', function (request, response) {

    MemberModel.findOne({username: 'mv740'}, function (err, member) {

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

router.get('/api/listView/', function (request, response) {

    MemberModel.findOne({username: 'mv740'}, function (err, member) {

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


router.post('/api/updateService', function (req, res) {
    console.log(req.body);
    var newType = req.body.service.newType;
    var newName = req.body.service.newName;
    var currentType = req.body.service.type;
    var currentName = req.body.service.name;

    var newService = {
        serviceName: newName
    };


    //only name changed
    if (newType === currentType) {

        MemberModel.findOne({
                "username": 'mv740',
                "ServiceSetting.serviceType": currentType,
                "ServiceSetting.service.serviceName": currentName
            },
            function (err, model) {
                //show the type document row []
                var foundTypeRow;
                var foundNameRow;
                for (var x = 0; x < model.ServiceSetting.length; x++) {
                    if (model.ServiceSetting[x].serviceType == currentType) {
                        foundTypeRow = x;
                    }
                }
                for (var y = 0; y < model.ServiceSetting[foundTypeRow].service.length; y++) {
                    if (model.ServiceSetting[foundTypeRow].service[y].serviceName == currentName) {
                        foundNameRow = y;
                    }
                }

                var name = "ServiceSetting." + foundTypeRow + ".service." + foundNameRow + ".serviceName";
                var update = {};
                update[name] = newName;

                //console.log(update);

                MemberModel.findOneAndUpdate({username: 'mv740'},
                    update,
                    function (err) {
                        console.log("test" + err);
                    });


                //console.log("X is : "+foundTypeRow);
                //console.log("Y is : "+foundNameRow);

                //console.log(models);

            });

        /*
         MemberModel.findOneAndUpdate({username: 'mv740', "ServiceSetting.serviceType": currentType,  "ServiceSetting.service.serviceName":currentName},
         {$set: {"ServiceSetting.$.service": [{"serviceName":"s"}]}},
         function (err, models) {
         console.log(err);
         //console.log(models);
         });
         */
    }


    //The $push operator appends a specified value to an array.
    /*
     //Todo Since we can't do double dot notation, we will to query to find the row id of settingSetting[?]
     MemberModel.findOneAndUpdate({username: 'mv740', "ServiceSetting.serviceType": type,  "ServiceSetting.service.serviceName":req.body.service.name},
     {$set: {"ServiceSetting.$.service": [{"serviceName":"s"}]}},
     function (err, models) {
     console.log(err);
     //console.log(models);
     });

     //
     MemberModel.findOne({ "username": 'mv740', "ServiceSetting.serviceType": type},
     function (err,models) {
     //show the type document row []
     var found;
     for(var x=0; x < models.ServiceSetting.length; x++)
     {
     if(models.ServiceSetting[x].serviceType == type)
     found =x;
     }


     var test = '{\'ServiceSetting.'+found+'.service.0.serviceName\': \'ddfd\'}';
     console.log(test);
     MemberModel.findOneAndUpdate({username: 'mv740'},
     {"ServiceSetting.1.service.0.serviceName": "mil"},
     function(err)
     {
     console.log("test"+err);
     });



     console.log("X is : "+found);

     //console.log(models);
     console.log("error: "+err);
     });

     */
    //console.log(req.body.service.type);
    res.end();
});


router.post('/api/hideService', function (req, res) {

    console.log(req.body);
    var serviceType = req.body.serviceType;
    var serviceName = req.body.serviceName;
    var serviceHide = req.body.serviceHide;

    //only name changed
    MemberModel.findOne({
            "username": 'mv740',
            "ServiceSetting.serviceType": serviceType,
            "ServiceSetting.service.serviceName": serviceName
        },
        function (err, model) {
            //show the type document row []
            var foundTypeRow;
            var foundNameRow;
            for (var x = 0; x < model.ServiceSetting.length; x++) {
                if (model.ServiceSetting[x].serviceType == serviceType) {
                    foundTypeRow = x;
                }
            }
            for (var y = 0; y < model.ServiceSetting[foundTypeRow].service.length; y++) {
                if (model.ServiceSetting[foundTypeRow].service[y].serviceName == serviceName) {
                    foundNameRow = y;
                }
            }

            var hide = "ServiceSetting." + foundTypeRow + ".service." + foundNameRow + ".serviceHide";
            var update = {};
            update[hide] = serviceHide;

            //console.log(update);

            MemberModel.findOneAndUpdate({username: 'mv740'},
                update,
                function (err) {
                    console.log("test" + err);
                });


            //console.log("X is : "+foundTypeRow);
            //console.log("Y is : "+foundNameRow);

            //console.log(models);

        });


    res.end();
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