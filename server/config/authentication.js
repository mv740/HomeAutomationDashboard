/**
 * Created by micha on 12/28/2015.
 */
    'use strict';

var passport = require('passport');
var mongoose = require('mongoose');
require('../../server/models/member');
var MemberModel = mongoose.model('MemberModel');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
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
            MemberModel.findOne({username: username}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                user.comparePassword(password, function (err, isMatch) {
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        console.error(password);
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                });
            });
        }
    ));
    // used to serialize the user for the session
    //passport.serializeUser(function (user, done) {
    //    done(null, user.id);
    //});
    passport.serializeUser( (user,done) => {
        var sessionUser = {
            _id: user.id,
            username : user.username,
            email : user.email
        };
        done(null,sessionUser);
    });
    // used to deserialize the user
    //passport.deserializeUser(function (id, done) {
    //    MemberModel.findById(id, function (err, user) {
    //        console.error(user);
    //        done(err, user);
    //    });
    //});
    passport.deserializeUser( (sessionUser, done) => {
        console.error(sessionUser);
        done(null,sessionUser);
    });


    passport.authentication = function (req, res, next) {
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
                console.log("AUTHENTICATION SUCCESSFUL - user : "+req.body.username);
                return res.send({success: true, message: 'authentication succeeded', username: req.body.username});
            });
        })(req, res, next);
    };

     passport.ensureAuthenticated = function (req, res, next) {
        if (!req.isAuthenticated())
            res.status(401).redirect("/login");
        else
            next();
    };

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(session({
        secret: '12e12e1e34rdf454g45t56yd45654y6ry67r6uyru',
        resave: false,
        saveUninitialized: true,
        cookie: {secured: true}
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    return passport;
};