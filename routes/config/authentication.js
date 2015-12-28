/**
 * Created by micha on 12/28/2015.
 */
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
module.exports = function (passport, app) {
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
};
