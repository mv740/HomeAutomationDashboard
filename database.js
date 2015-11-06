/**
 * Created by michal on 10/21/2015.
 * Database queries
 */



//todo each method must get username name from cookie
//here we use mv740 for now

exports.getServiceTypes = function (MemberModel, request, response) {
    MemberModel.findOne({username: 'mv740'}, function (err, member) {

        var list = [];
        //console.log(database);
        member.ServiceSetting.forEach(function (ServiceSetting) {
                var serviceType = ServiceSetting.serviceType;
                var object = {
                    "serviceType": serviceType
                };
                list.push(object);
            }
        );

        return response.send(list);
    }).lean();

};

exports.insertService = function (MemberModel, req, res) {

    console.log(req.body);
    var type = req.body.service.type;

    var newService = {
        serviceName: req.body.service.name,
        serviceHide: false
    };
    //The $push operator appends a specified value to an array.
    MemberModel.findOneAndUpdate({username: 'mv740', "ServiceSetting.serviceType": type},
        {$push: {"ServiceSetting.$.service": newService}},
        function (err, model) {
            console.log(err);
            //console.log(models);
        });
    res.end();
};

exports.deleteService = function (MemberModel, req, res) {
    console.log(req.body);
    var type = req.body.service.type;

    var newService = {
        serviceName: req.body.service.name
    };
    //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    MemberModel.findOneAndUpdate({
            username: 'mv740',
            "ServiceSetting.serviceType": type,
            "ServiceSetting.service.serviceName": req.body.service.name
        },
        {$pull: {"ServiceSetting.$.service": newService}},
        function (err, model) {
            console.log(err);
            //console.log(models);
        });


    //console.log(req.body.service.type);
    res.end();
};

