/**
 * Created by michal on 9/20/2015.
 * PARTICLE.IO API wrapper
 */
'use strict';
var needle = require('needle');

//url: 'https://api.particle.io/v1/devices/280021000547343339373536/Temperature?access_token=0b6c8c27e98ce61d0895f31abe160695ed5d11c5',
var errorMessage;

exports.getDevice = function (tag, callback) {

    needle.get('https://api.particle.io/v1/devices/280021000547343339373536/Temperature?access_token=0b6c8c27e98ce61d0895f31abe160695ed5d11c5', {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {

            return callback(response.body);

        } else {
            errorMessage = {
                "error": {
                    "functionName": "particle-getDevice",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }
            };
            return callback(errorMessage);
        }
    });
};

exports.getTemperature = function (tag, callback) {

    needle.get('https://api.particle.io/v1/devices/280021000547343339373536/Temperature?access_token=0b6c8c27e98ce61d0895f31abe160695ed5d11c5', {rejectUnauthorized: false}, function (error, response) {
        if (!error) {

            var msg = {
                particule: {
                    name: response.body.name,
                    temperature: response.body.result
                }
            };
            return callback(msg);

        } else {
            errorMessage = {
                "error": {
                    "functionName": "particle-getDevice",
                    "message": "error"
                }
            };
            return callback(errorMessage);
        }
    });
};
