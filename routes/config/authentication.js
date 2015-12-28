/**
 * Created by micha on 12/28/2015.
 */
var passport = require('passport');
var mongoose = require('mongoose');
require('../../models/member');
var MemberModel = mongoose.model('MemberModel');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session
module.exports = function (app) {
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
                user.comparePassword(password, function(err,isMatch){
                    if(isMatch)
                    {
                        return done(null,user);
                    }else {
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                })
            });
        }
    ));
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        MemberModel.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.authentication = function(req, res, next) {
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

    };


    app.use(flash());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {secured: false}
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    return passport;
};

exports.authentication = function(req, res, next) {
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

};