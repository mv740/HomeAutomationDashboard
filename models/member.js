/**
 * Created by micha on 10/24/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var service = new Schema(
    {
        serviceName: String,
        serviceHide: Boolean
    }
);

var ServiceSetting = new Schema(
    {
        "serviceType": String,
        service: [service]
    }
);
var Member = new Schema(
    {
        username: {type : String, required : true, unique : true},
        password: {type : String, required : true},
        email : {type : String, required : true, unique : true},
        ServiceSetting: [ServiceSetting]
    }
);


mongoose.model('MemberModel', Member, 'Member');
