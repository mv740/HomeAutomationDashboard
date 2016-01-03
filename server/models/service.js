/**
 * Created by micha on 12/25/2015.
 */
    'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var service = new Schema(
    {
        type: String,
        description : String
    }
);

mongoose.model('ServiceModel', service, 'service');
