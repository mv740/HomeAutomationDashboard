/**
 * Created by Michal Wozniak on 1/3/2016.
 */
var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();

var mongoose = require('mongoose');
require('../../server/models/member');
var MemberModel = mongoose.model('MemberModel');

describe('Member : models', function () {
    describe('#generatePassHash()', function(){
        it('should return a hashed password asynchronously', function (done) {
            var password = 'secret';

            MemberModel.generatePassHash(password,10,function(err, hash){
                //confirm no error
                should.not.exist(err);
                //confirm hash is not null
                should.exist(hash);
                done();
            });
        });
    });
    describe('#comparePassword()', function(){
        it('should return true if password is valid', function (done) {
            var password = 'secret';

            MemberModel.generatePassHash(password,10,function(err, passwordHash){

                var memberTest = new MemberModel(
                    {
                        "username": 'memberTest',
                        "password": passwordHash,
                        "email": 'memberTest@test.com'
                    }
                );

                memberTest.comparePassword(password, function(err, areEqual){
                    // no error
                    should.not.exist(err);
                    //equal is true
                    areEqual.should.equal(true);

                    done();
                });
            });
        });
        it('should return false if password is invalid', function (done) {
            var password = 'secret';

            MemberModel.generatePassHash(password,10,function(err, passwordHash){

                var memberTest = new MemberModel(
                    {
                        "username": 'memberTest',
                        "password": passwordHash,
                        "email": 'memberTest@test.com'
                    }
                );

                var wrongPassword = 'test';
                memberTest.comparePassword(wrongPassword, function(err, areEqual){
                    // no error
                    should.not.exist(err);
                    //equal is true
                    areEqual.should.equal(false);

                    done();
                });
            });
        });
    })
});