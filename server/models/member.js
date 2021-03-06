/**
 * Created by micha on 10/24/2015.
 */

    'use strict';

var bcrypt = require('bcrypt');
var crypto = require('crypto');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var service = new Schema(
    {
        serviceName: String,
        serviceHide: Boolean
    }
);

var ServiceSetting = new Schema(
    {
        "serviceType": String,
        service: [service]
    }
);
var Member = new Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        ServiceSetting: [ServiceSetting]
    }
);
//https://github.com/ncb000gt/node.bcrypt.js
Member.statics.generatePassHash = function (password, SALT_FACTOR, callback) {
    bcrypt.hash(password, SALT_FACTOR, callback)
};

Member.pre('save', function (next) {
    var member = this;
    var SALT_FACTOR = 10;
    if (!member.isModified('password'))
        return next();

    function setNewPassword(err, hash) {
        member.password = hash;
        next();
    }
    Member.generatePassHash(member.password, SALT_FACTOR, setNewPassword);
    //bcrypt.hash(member.password, SALT_FACTOR, function (err, hash) {
    //    member.password = hash;
    //    next();
    //});
});

Member.methods.comparePassword = function (possiblePassword, callback) {
    bcrypt.compare(possiblePassword, this.password, function (error, isMatch) {
        if (error) return callback(error);
        callback(null, isMatch);
    });
};

mongoose.model('MemberModel', Member, 'Member');
