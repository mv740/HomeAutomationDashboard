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
        username: String,
        password: String,
        ServiceSetting: [ServiceSetting]
    }
);


mongoose.model('MemberModel', Member, 'Member');
