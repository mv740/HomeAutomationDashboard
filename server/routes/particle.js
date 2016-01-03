/**
 * Created by micha on 12/28/2015.
 */
'use strict';

//================================== routes for particle API ====================================
var particle = require('../../server/controllers/particle');
var express = require('express');

var api = express.Router();

api.get('/:tag', function (request, response) {
    var tag = request.params.tag;
    particle.getDevice(tag, function (value) {
        response.send(value);
    });
});
api.get('/temperature/:tag', function (request, response) {
    var tag = request.params.tag;
    particle.getTemperature(tag, function (value) {
        response.send(value);
    });
});

module.exports = api;
