/**
 * Created by Michal Wozniak on 12/29/2015.
 */

    'use strict';

var nodemailer = require('nodemailer');
var config = require('../config/email');

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
            return {
                to: this.to,
                from: this.from,
                subject: this.subject,
                text: this.text
            };
        }
    };
};
/**
 * send the message to the requested users
 * @param emailMessage - required email message object
 */
exports.send = function (emailMessage) {
    var smtp = nodemailer.createTransport({
        service: config.service,
        auth: config.account
    });

    smtp.sendMail(emailMessage, function (error) {
        if (error) {
            console.error(error);
        }
    });
};