/**
 * Created by micha on 9/7/2015.
 */
'use strict';

var express = require('express');
var router = express.Router();
var prtg = require('../prtg');
var particle = require('../particle');


var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/NodeTutorial'); // pool of 5 connection default



var service = new Schema({serviceName: String, serviceHide: Boolean});
var ServiceSetting = new Schema({
    "serviceType": String,
    service: [service]
});
var Member = new Schema(
    {
        username: String,
        password: String,
        ServiceSetting: [ServiceSetting]
    }
);


var MemberModel = mongoose.model('MemberModel', Member, 'Member');
Member.statics.findByUsername = function (username, cb) {
    return this.find({username: username}, cb)
};

/////////////////////////////////////////////////////////////////////////////
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

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
    res.redirect('/');
});

//todo : create cliend side service that will catch 401/200 status code
router.post('/public/loginPage.html',
    passport.authenticate('local1'),
    function(req, res){
        res.sendStatus(200);
    }
);
router.get('/public/loginPage.html', function (req, res) {
    console.log(req.flash('error'));
    var log = (req.flash('error'));

    res.sendStatus(req.flash('success', 'This is a flash message using the express-flash module.'));
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

        //console.log(member);
        var serviceType = member.serviceType;

        var list = [];
        //console.log(member);
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

        //console.log(member);
        var serviceType = member.serviceType;

        var list = [];
        //console.log(member);
        member.ServiceSetting.forEach(function (ServiceSetting) {
                var serviceType = ServiceSetting.serviceType;
                ServiceSetting.service.forEach(function (service) {
                    //console.log(serviceType);
                    if(!service.serviceHide)
                    {
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

    MemberModel.findOne({username: 'mv740'}, function (err, member) {

        //console.log(member);
        var serviceType = member.serviceType;

        var list = [];
        //console.log(member);
        member.ServiceSetting.forEach(function (ServiceSetting) {
                var serviceType = ServiceSetting.serviceType;
                var object = {
                    "serviceType":serviceType
                };
                list.push(object);
            }
        );

        return response.send(list);
    }).lean();

});

router.post('/api/insertService', function (req, res) {

    console.log(req.body);
    var type = req.body.service.type;

    var newService = {
        serviceName: req.body.service.name,
        serviceHide: false
    };
    console.log(newService);
    //The $push operator appends a specified value to an array.
    MemberModel.findOneAndUpdate({username: 'mv740', "ServiceSetting.serviceType": type},
        {$push: {"ServiceSetting.$.service": newService}},
        function (err, model) {
            console.log(err);
            //console.log(model);
        });


    //console.log(req.body.service.type);
    res.end();
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
    if(newType === currentType)
    {

        MemberModel.findOne({ "username": 'mv740', "ServiceSetting.serviceType": currentType, "ServiceSetting.service.serviceName":currentName},
            function (err,model) {
                //show the type document row []
                var foundTypeRow;
                var foundNameRow;
                for(var x=0; x < model.ServiceSetting.length; x++)
                {
                    if(model.ServiceSetting[x].serviceType == currentType)
                    {
                        foundTypeRow =x;
                    }
                }
                for(var y=0; y < model.ServiceSetting[foundTypeRow].service.length; y++)
                {
                    if(model.ServiceSetting[foundTypeRow].service[y].serviceName == currentName)
                    {
                        foundNameRow = y;
                    }
                }

                var name = "ServiceSetting."+foundTypeRow+".service."+foundNameRow+".serviceName";
                var update ={};
                update[name] = newName;

                //console.log(update);

                MemberModel.findOneAndUpdate({username: 'mv740'},
                    update,
                    function(err)
                    {
                        console.log("test"+err);
                    });



                //console.log("X is : "+foundTypeRow);
                //console.log("Y is : "+foundNameRow);

                //console.log(model);

            });

        /*
        MemberModel.findOneAndUpdate({username: 'mv740', "ServiceSetting.serviceType": currentType,  "ServiceSetting.service.serviceName":currentName},
            {$set: {"ServiceSetting.$.service": [{"serviceName":"s"}]}},
            function (err, model) {
                console.log(err);
                //console.log(model);
            });
            */
    }



    //The $push operator appends a specified value to an array.
    /*
    //Todo Since we can't do double dot notation, we will to query to find the row id of settingSetting[?]
    MemberModel.findOneAndUpdate({username: 'mv740', "ServiceSetting.serviceType": type,  "ServiceSetting.service.serviceName":req.body.service.name},
        {$set: {"ServiceSetting.$.service": [{"serviceName":"s"}]}},
        function (err, model) {
            console.log(err);
            //console.log(model);
        });

    //
    MemberModel.findOne({ "username": 'mv740', "ServiceSetting.serviceType": type},
        function (err,model) {
            //show the type document row []
            var found;
            for(var x=0; x < model.ServiceSetting.length; x++)
            {
                if(model.ServiceSetting[x].serviceType == type)
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

            //console.log(model);
            console.log("error: "+err);
        });

    */
    //console.log(req.body.service.type);
    res.end();
});


router.post('/api/hideService', function (req, res) {

    console.log(req.body);
    var serviceType= req.body.serviceType;
    var serviceName= req.body.serviceName;
    var serviceHide= req.body.serviceHide;

    //only name changed
    MemberModel.findOne({ "username": 'mv740', "ServiceSetting.serviceType": serviceType, "ServiceSetting.service.serviceName":serviceName},
        function (err,model) {
            //show the type document row []
            var foundTypeRow;
            var foundNameRow;
            for(var x=0; x < model.ServiceSetting.length; x++)
            {
                if(model.ServiceSetting[x].serviceType == serviceType)
                {
                    foundTypeRow =x;
                }
            }
            for(var y=0; y < model.ServiceSetting[foundTypeRow].service.length; y++)
            {
                if(model.ServiceSetting[foundTypeRow].service[y].serviceName == serviceName)
                {
                    foundNameRow = y;
                }
            }

            var hide = "ServiceSetting."+foundTypeRow+".service."+foundNameRow+".serviceHide";
            var update ={};
            update[hide] = serviceHide;

            //console.log(update);

            MemberModel.findOneAndUpdate({username: 'mv740'},
                update,
                function(err)
                {
                    console.log("test"+err);
                });



            //console.log("X is : "+foundTypeRow);
            //console.log("Y is : "+foundNameRow);

            //console.log(model);

        });



    res.end();
});

router.post('/api/deleteService', function (req, res) {

    console.log(req.body);
    var type = req.body.service.type;

    var newService = {
        serviceName: req.body.service.name
    };
    //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    MemberModel.findOneAndUpdate({username: 'mv740', "ServiceSetting.serviceType": type,  "ServiceSetting.service.serviceName":req.body.service.name},
        {$pull: {"ServiceSetting.$.service": newService}},
        function (err, model) {
            console.log(err);
            //console.log(model);
        });


    //console.log(req.body.service.type);
    res.end();
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
router.get('*', function(req, res){
    res.redirect('/')
});
module.exports = router;