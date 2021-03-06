/**
 * Created by Michal Wozniak on 12/29/2015.
 */

'use strict';

var nodemailer = require('nodemailer');
var config = require('../config/config');

/**
 * generate a email message object
 * @returns {{to: to, from: from, subject: subject, text: text, build: build}}
 */
exports.emailMessage = function () {
    return {
        /**
         @param {String} To - list of receivers
         */
        to: function (To) {
            this.to = To;
            return this;
        },
        /**
         @param {String} From - sender address
         */
        from: function (From) {
            this.from = From;
            return this;
        },
        /**
         @param {String} Subject - Subject line
         */
        subject: function (Subject) {
            this.subject = Subject;
            return this;
        },
        /**
         @param {String} Text - plaintext body
         */
        text: function (Text) {
            this.text = Text;
            return this;
        },
        /**
         * return Email message
         */
        build: function () {

            var message = {};
            if (typeof this.to !== 'function')
                message.to = this.to;
            if (typeof this.from !== 'function')
                message.from = this.from;
            if (typeof this.subject !== 'function')
                message.subject = this.subject;
            if (typeof this.text !== 'function')
                message.text = this.text;

            return message;
        }
    };
};
/**
 * send the message to the requested users
 * @param emailMessage - required email message object
 */
exports.send = function (emailMessage) {
    var smtp = nodemailer.createTransport({
        service: config.email.service,
        auth: config.email.account
    });

    smtp.sendMail(emailMessage, function (error) {
        if (error) {
            console.error(error);
        }
    });
};