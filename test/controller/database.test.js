/**
 * Created by Michal Wozniak on 1/12/2016.
 */
'use strict';
var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();
var database = require('../../server/controllers/database');
var mongoose = require('mongoose');
var utils = require('../utils');

//https://www.terlici.com/2014/09/15/node-testing.html
//todo create new test database before each test and then drop them after
var config = require('../../server/config/config');
mongoose.connect(config.db.development);



describe('Database', function () {
    describe('initializeServices()', function () {
        it('service collection must exist in the database ', function (done) {
            database.initializeServices();

            done();

        });
        it('service collection must contains default services', function (done) {
            done();
        });
    });
});