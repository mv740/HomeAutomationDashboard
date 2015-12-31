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
require('../../server/models/member');
var MemberModel = mongoose.model('MemberModel');


var passport = require('../../server/config/authentication.js')(router);

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

router.get('/api/list/', passport.ensureAuthenticated, function (request, response) {

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
var account = require('../config/email');
var Promise = require("bluebird");
var crypto = Promise.promisifyAll(require('crypto'));
var nodemailer = require('nodemailer');
var generateResetPasswordToken = function (email, req, res) {

    return generateRandomBytes()
        .then(BytesToHexString)
        .then(saveToken);
    //.then(sendResetEmail);

    function generateRandomBytes() {
        return crypto.randomBytesAsync(32);
    }

    function BytesToHexString(buf) {
        return buf.toString('hex');
    }

    //todo refactor this to extract smtp configs and make this like a service function
    function sendResetEmail(data) {

        var smtp = nodemailer.createTransport({
            service: 'gmail',
            auth: account
        });
        var mailOptions = {
            to: data.email,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'https://' + req.headers.host + '/reset/' + data.token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtp.sendMail(mailOptions, function (error) {
            if (error) {
                console.error(error);
            } else {
                res.send({'msg': 'reset process started for  ' + email});
            }
        });
    }

    function saveToken(token, callback) {

        //check if user exist
        MemberModel.findOne({email: email}, function (err, user) {
            if (!user) {
                res.status(409).send({error: 'No account with that email address exists.'})
            } else {

                //console.log(token);
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                var data = {
                    'token': token,
                    'email': user.email
                };

                user.save(function (error) {
                    if (error) {
                        res.status(409).send({'error': 'reset process failed to start'});
                    } else
                        sendResetEmail(data);
                });
            }
        });
        //return {'test':'wtf'}


    }


};

router.post('/forgot', function (req, res) {
    var email = req.body.email;
    generateResetPasswordToken(email, req, res);
});

router.get('/reset/:token', function (req, res) {
    console.log('hello');
    MemberModel.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }, function (err, user) {
        if (!user) {
            console.error('wrong token');
        } else {
            req.session.token = req.params.token;
            res.redirect('/reset');
            //res.sendFile('public/views/partials/reset-password.html', rootDirectoryPath);
            //res.sendFile('public/views/partials/reset-password.html', rootDirectoryPath);
        }
    });
});

function passwordResetEmailConfirmation(email) {

    var smtp = nodemailer.createTransport({
        service: 'gmail',
        auth: account
    });
    var mailOptions = {
        to: email,
        from: 'passwordreset@MyDashboard.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
    };
    smtp.sendMail(mailOptions, function (error) {
        if (error) {
            console.error(error);
        }
    });
}

router.post('/reset/', function (req, res) {
    MemberModel.findOne({
        resetPasswordToken: req.session.token,
        resetPasswordExpires: {$gt: Date.now()}
    }, function (err, user) {
        if (!user) {
            res.status(403).send({'error': 'Password reset token is invalid or has expired.'});
        } else {

            user.password = req.body.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
                if (err)
                    console.error(err);
                passwordResetEmailConfirmation(user.email);
                res.end();
            });
        }
    });
});

//router.post('/test', function (req, res) {
//    //todo http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
//    function
//
//    MemberModel.findOne({email: req.body.email}, function(err, user)
//    {
//        if(!user)
//        {
//            res.status(409).send({'error':'No account with that email address exists.'})
//        }else
//        {
//            user.resetPasswordToken = token
//        }
//    })
//});

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