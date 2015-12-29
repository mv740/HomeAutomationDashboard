/**
 * Created by michal on 12/28/2015.
 */
//================================== routes for PRTG API ====================================
var prtg = require('../prtg');
var express = require('express');

'use strict';
var api = express.Router();

api.get('/sensorDetails/:id', function (request, response) {
    var id = request.params.id;
    prtg.getSensorDetails(id, function (value) {
        response.send(value);
    });

});
api.get('/loggedUsers/:id', function (request, response) {
    var id = request.params.id;
    prtg.getLoggedUsers(id, function (value) {
        response.send(value);
    });
});
api.get('/systemStatus', function (request, response) {
    prtg.getSystemStatus(function (value) {
        response.send(value);
    });
});
api.get('/device/:tag', function (request, response) {
    var tag = request.params.tag;
    prtg.getDevice(tag, function (value) {
        response.send(value);
    });
});
api.get('/memory/:id', function (request, response) {
    var id = request.params.id;
    prtg.getMemory(id, function (value) {
        response.send(value);
    });
});
api.get('/cpu/:id', function (request, response) {
    var id = request.params.id;
    prtg.getCPU(id, function (value) {
        response.send(value);
    });
});
api.get('/disk/:id', function (request, response) {
    var id = request.params.id;
    prtg.getDisk(id, function (value) {
        response.send(value);
    });
});

api.get('/logs/', function (request, response) {
    //?limit=number&maxLength=number
    var limit = request.query.limit;
    var msgLength = request.query.msgLength;
    prtg.getLogs(limit, msgLength, function (value) {
        response.send(value);
    });
});
api.get('/groupDevices/:groupID', function (request, response) {
    var groupID = request.params.groupID;
    prtg.getGroupDevices(groupID, function (value) {
        response.send(value);
    });
});
api.get('/upTime/:id', function (request, response) {
    var id = request.params.id;
    prtg.getUpTime(id, function (value) {
        response.send(value);
    });
});
api.get('/ping/:id', function (request, response) {
    var id = request.params.id;
    prtg.getPing(id, function (value) {
        response.send(value);
    });
});
api.get('/customSensor/:tag', function (request, response) {
    var tag = request.params.tag;
    prtg.getCustomSensor(tag, function (value) {
        response.send(value);
    });
});

api.get('/graph/:id/:hide?', function (request, response) {
    var id = request.params.id;
    var hide = request.params.hide;
    prtg.getGraph(id, hide, function (value) {
        response.send(value);
    });
});

module.exports =  api;
