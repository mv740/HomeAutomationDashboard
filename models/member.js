/**
 * Created by micha on 10/24/2015.
 */

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
Member.methods.generatePassHash = function (password) {
    bcrypt.hash(password, 10, function (err, hash) {

    })
};

Member.pre('save', function (next) {
    var newMember = this;
    bcrypt.hash(newMember.password, 10, function (err, hash) {
        newMember.password = hash;
        next();
    });
});

Member.methods.comparePassword = function (possiblePassword, callback) {
    bcrypt.compare(possiblePassword, this.password, function (error, isMatch) {
        if (error) return callback(error);
        callback(null, isMatch);
    })
};

mongoose.model('MemberModel', Member, 'Member');
