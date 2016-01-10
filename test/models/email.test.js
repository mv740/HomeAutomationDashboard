/**
 * Created by Michal Wozniak on 1/10/2016.
 */
var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();
var builder = require('../../server/models/email');

describe('Email : models', function () {
    describe('#create emailMessage', function () {
        it('message body should only contain the parameter values from the builder process', function (done) {
            //for this,don't return undefined from, subject options
            var email = builder.emailMessage()
                .to('test@test.com')
                .text('hello world')
                .build();
            should.not.exist(email.from);
            should.not.exist(email.subject);
            done();
        });
    });
});
