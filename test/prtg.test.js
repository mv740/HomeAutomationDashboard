/**
 * Created by michal on 9/8/2015.
 */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();
var prtg = require('../server/controllers/prtg');

describe('API-getSensorDetails', function () {
    it('it must return a OBJECT ', function (done) {
        prtg.getSensorDetails(1, function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        prtg.getSensorDetails(3, function(reply){
            reply.should.have.property('error');
            done();
        });
    });
});
describe('API-getLoggedUsers', function () {
    it('it must return a OBJECT ', function (done) {
        prtg.getLoggedUsers(1, function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        prtg.getSensorDetails(3, function(reply){
            reply.should.have.property('error');
            done();
        });
    });
});
describe('API-getSystemStatus', function () {
    it('it must return a Object ', function (done) {
        prtg.getSystemStatus(function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        prtg.getSensorDetails(3, function(reply){
            reply.should.have.property('error');
            done();
        });
    });
});
describe('API-getDevice', function () {
    it('it must return a Object ', function (done) {
        prtg.getDevice(1,function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        prtg.getSensorDetails(3, function(reply){
            reply.should.have.property('error');
            done();
        });
    });
});
describe('API-getMemory', function () {
    it('it must return a Object ', function (done) {
        prtg.getMemory(1,function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        prtg.getSensorDetails(3, function(reply){
            reply.should.have.property('error');
            done();
        });
    });
});
describe('API-getCPU', function () {
    it('it must return a Object ', function (done) {
        prtg.getCPU(1,function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        prtg.getSensorDetails(3, function(reply){
            reply.should.have.property('error');
            done();
        });
    });
});
describe('API-getDisk', function () {
    it('it must return a Object ', function (done) {
        prtg.getDisk(1,function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
    it('it should return a error Object when sensor isn\'t found', function (done) {
        prtg.getSensorDetails(3, function(reply){
            reply.should.have.property('error');
            done();
        });
    });
});
describe('API-getLogs', function () {
    it('it must return a Object ', function (done) {
        prtg.getLogs(1,30,function(reply){
            expect(reply).to.be.a('Object');
            done();
        });
    });
});