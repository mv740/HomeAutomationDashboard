/**
 * Created by michal on 9/8/2015.
 */
'use strict';
var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();
var prtg = require('../../server/controllers/prtg');
var nock = require('nock');
var config = require('./../../server/config/prtgConfig');

//https://github.com/pgte/nock
describe('API-getSensorDetails', function () {
    it('id must be a integer ', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getsensordetails.json')
            .query({"id": "1", "username": config.authentication.username, "password": config.authentication.password})
            .reply(200, {
                "prtgversion": "15.4.21.5481",
                "sensordata": {"name": "Local probe", "sensortype": "probenode", "lastmessage": "OK"}
            });

        prtg.getSensorDetails("String", function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "Id must be a integer");
            done();
        });
    });
    it('it must return a OBJECT containing sensordata ', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getsensordetails.json')
            .query({"id": "1", "username": config.authentication.username, "password": config.authentication.password})
            .reply(200);

        prtg.getSensorDetails(1, function (reply) {
            reply.should.have.deep.property('prtg.sensordata.name', 'Local probe');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getsensordetails.json')
            .query({"id": "3", "username": config.authentication.username, "password": config.authentication.password})
            .reply(200, {
                "prtgversion": "15.4.21.5481",
                "sensordata": {"name": "", "sensortype": "(Object not found)"}
            });

        prtg.getSensorDetails(3, function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message');
            reply.should.have.deep.property('error.message', "Sensor not Found");
            done();
        });
    });
    it('bad request from server', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getsensordetails.json')
            .query({"id": "3", "username": config.authentication.username, "password": config.authentication.password})
            .reply(400);

        prtg.getSensorDetails(3, function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });
});

describe('API-getLoggedUsers', function () {
    it('id must be a integer ', function (done) {
        prtg.getSensorDetails("String", function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "Id must be a integer");
            done();
        });
    });
    it('sensor type must be ptfloggedinusers, therefore must have a logged user', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getsensordetails.json')
            .query({
                "id": "2117",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {
                "prtgversion": "16.1.21.1257",
                "sensordata": {
                    "name": "Users logged in 1",
                    "sensortype": "ptfloggedinusers",
                    "lastvalue": "1 #",
                    "lastmessage": "User Administrator is loggedin on HYPERVHOST1"
                }
            });

        //
        prtg.getLoggedUsers(2117, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.deep.property('prtg.sensordata.sensortype', 'ptfloggedinusers');
            expect(reply).to.have.deep.property('prtg.sensordata.lastmessage', ' Administrator');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t the of type ptfloggedinusers', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getsensordetails.json')
            .query({"id": "3", "username": config.authentication.username, "password": config.authentication.password})
            .reply(200, {"prtgversion": "15.4.21.5481", "sensordata": {"name": "", "sensortype": "test"}});

        prtg.getLoggedUsers(3, function (reply) {
            reply.should.have.deep.property('error.message', 'Sensor not Found');
            done();
        });
    });
    it('bad request from server', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getsensordetails.json')
            .query({"id": "3", "username": config.authentication.username, "password": config.authentication.password})
            .reply(400);

        prtg.getLoggedUsers(3, function (reply) {
            reply.should.have.deep.property('error.message', 'Status Code error');
            done();
        });
    });
});

describe('API-getSystemStatus', function () {
    it('it must return a Object ', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getstatus.htm')
            .query({"id": "0", "username": config.authentication.username, "password": config.authentication.password})
            .reply(200, {"NewMessages": "0", "NewAlarms": "0"}, {
                connection: 'close',
                'content-type': 'text/html; charset=UTF-8'
            });

        prtg.getSystemStatus(function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.deep.property('prtg.NewMessages');
            done();
        });
    });
    it('bad request from server', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/getstatus.htm')
            .query({"id": "0", "username": config.authentication.username, "password": config.authentication.password})
            .reply(400);

        prtg.getSystemStatus(function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });
});
//todo see if it is possible to get device by device name
describe('API-getDevice -- Require an existing tag for testing', function () {
    it('it must return a Object ', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "plex",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {
                "prtg-version": "15.4.21.5481",
                "treesize": 1,
                "sensors": [{"objid": 2121, "device": "HYPERVHOST1", "sensor": "Plex"}]
            });

        //nock.recorder.rec();
        prtg.getDevice('plex', function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.property('prtg');
            reply.should.have.deep.property('prtg.sensors[0].sensor', 'Plex');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "TEST",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {"prtg-version": "15.4.21.5481", "treesize": 0, "sensors": []});

        prtg.getDevice('TEST', function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "Device not Found");
            done();
        });
    });
    it('bad request from server', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "TEST",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(400);

        prtg.getDevice("TEST", function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });
});

describe('API-getMemory', function () {
    it('id must be a integer ', function (done) {
        prtg.getMemory("StringTest", function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "Id must be a integer");
            done();
        });
    });
    it('it must return a Object containing a memory sensor tag', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,probe,group,device,sensor,status,message,lastvalue,priority,favorite,tags",
                "id": "1",
                "filter_tags": "memorysensor",
                "username": "admin",
                "password": "Wozm06118909"
            })
            .reply(200, {
                "prtg-version": "16.1.21.1257",
                "treesize": 1,
                "sensors": [{"objid": 2035, "tags": "memorysensor wmimemorysensor memory C_OS_Win guru"}]
            });

        prtg.getMemory(1, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.property('prtg');
            expect(reply.prtg.sensors[0].tags).to.contains("memorysensor");
            done();
        });
    });
    it('it should return a error Object when memory sensor isn\'t found', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,probe,group,device,sensor,status,message,lastvalue,priority,favorite,tags",
                "id": "1",
                "filter_tags": "memorysensor",
                "username": "admin",
                "password": "Wozm06118909"
            })
            .reply(200, {"prtg-version": "16.1.21.1257", "treesize": 0, "sensors": []});

        prtg.getMemory(1, function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "This device has no memory sensor ");
            done();
        });
    });
    it('bad request from server', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,probe,group,device,sensor,status,message,lastvalue,priority,favorite,tags",
                "id": "1",
                "filter_tags": "memorysensor",
                "username": "admin",
                "password": "Wozm06118909"
            })
            .reply(400);
        //nock.recorder.rec();
        prtg.getMemory(1, function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });
});

describe('API-getCPU', function () {
    it('id must be a integer ', function (done) {
        prtg.getCPU("StringTest", function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "Id must be a integer");
            done();
        });
    });
    it('it must return a Object containing a cpu sensor tag', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "cpuloadsensor",
                "id": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {
                "prtg-version": "16.1.21.1257",
                "treesize": 1,
                "sensors": [{"objid": 1, "tags": "cpuloadsensor C_OS_Win guru"}]
            });

        prtg.getCPU(1, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.property('prtg');
            expect(reply.prtg.sensors[0].tags).to.contains("cpuloadsensor");
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "cpuloadsensor",
                "id": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {"prtg-version": "16.1.21.1257", "treesize": 0, "sensors": []});

        prtg.getCPU(1, function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "This device has no cpu sensor ");
            done();
        });
    });
    it('bad request from server', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "cpuloadsensor",
                "id": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(400);
        // nock.recorder.rec();
        prtg.getCPU(1, function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });

});
describe('API-getDisk', function () {
    it('id must be a integer ', function (done) {
        prtg.getDisk("StringTest", function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "Id must be a integer");
            done();
        });
    });
    it('it must return a Object containing a disk sensor tag', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "diskspacesensor",
                "id": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {
                "prtg-version": "16.1.21.1257",
                "treesize": 1,
                "sensors": [{"objid": 1, "tags": "diskspacesensor C_OS_Win guru"}]
            });

        prtg.getDisk(1, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.property('prtg');
            expect(reply.prtg.sensors[0].tags).to.contains("diskspacesensor");
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "diskspacesensor",
                "id": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {"prtg-version": "16.1.21.1257", "treesize": 0, "sensors": []});

        prtg.getDisk(1, function (reply) {
            reply.should.have.property('error');
            reply.should.have.deep.property('error.message', "This device has no disk sensor ");
            done();
        });
    });
    it('bad request from server', function (done) {

        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "sensors",
                "output": "json",
                "columns": "objid,device,sensor,status,lastvalue,tags",
                "filter_tags": "diskspacesensor",
                "id": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(400);
        // nock.recorder.rec();
        prtg.getDisk(1, function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });

});
describe('API-getLogs', function () {
    it('it must return a Object containing messages', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "messages",
                "output": "json",
                "columns": "objid,datetime,parent,type,name,status,message",
                "count": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {
                "prtg-version": "16.1.21.1257", "treesize": 50, "messages": [{
                    "objid": 2164,
                    "datetime": "1/21/2016 9:22:19 PM",
                    "datetime_raw": 42391.0988343634,
                    "parent": "192.168.1.4",
                    "type": "Ping",
                    "type_raw": "ping",
                    "name": "PING 13",
                    "status": "Up",
                    "status_raw": 607,
                    "message": "<div class=\"logmessage\">174 msec<div class=\"moreicon\"></div></div>",
                    "message_raw": "174 msec"
                }]
            });

        prtg.getLogs(1, 30, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.deep.property('prtg.messages');
            done();
        });
    });
    it('it should return a error Object when logs are empty', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "messages",
                "output": "json",
                "columns": "objid,datetime,parent,type,name,status,message",
                "count": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(200, {"prtg-version": "16.1.21.1257", "treesize": 0, "messages": []});

        prtg.getLogs(1, 30, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.deep.property('error.message', 'Logs are empty');
            done();
        });
    });
    it('bad request from server', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({
                "content": "messages",
                "output": "json",
                "columns": "objid,datetime,parent,type,name,status,message",
                "count": "1",
                "username": config.authentication.username,
                "password": config.authentication.password
            })
            .reply(400);

        prtg.getLogs(1, 30, function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });
});

describe('API-getGroupDevice', function () {
    it('it must return a Object containing a device property', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({"content":"devices","columns":"objid,probe,group,device","id":"1","username":config.authentication.username,"password":config.authentication.password})
            .reply(200, {"prtg-version": "16.1.21.1257", "treesize": 1, "devices": [{"objid":1111,"probe":"Local probe","group":"Test","device":"TestDevice"}]});
        prtg.getGroupDevices(1, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.deep.property('prtg.devices[0].group');
            done();
        });
    });
    it('it must return a error Object when the group has no devices ', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({"content":"devices","columns":"objid,probe,group,device","id":"1","username":config.authentication.username,"password":config.authentication.password})
            .reply(200, {"prtg-version": "16.1.21.1257", "treesize": 0, "devices": []});
        prtg.getGroupDevices(1, function (reply) {
            expect(reply).to.be.a('Object');
            expect(reply).to.have.deep.property('error.message','Groups is empty');
            done();
        });
    });
    it('bad request from server', function (done) {
        var prtgServer = nock(config.host, {"encodedQueryParams": true})
            .get('/api/table.json')
            .query({"content":"devices","columns":"objid,probe,group,device","id":"1","username":config.authentication.username,"password":config.authentication.password})
            .reply(400);

        prtg.getGroupDevices(1, function (reply) {
            reply.should.have.deep.property('error.message', "Status Code error");
            done();
        });
    });
});
