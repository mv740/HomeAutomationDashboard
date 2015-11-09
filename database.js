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

exports.hideServices = function (MemberModel, req, res) {
    var serviceType = req.body.serviceType;
    var serviceName = req.body.serviceName;
    var serviceHide = req.body.serviceHide;

    //only name changed
    MemberModel.findOne({
            "username": 'mv740',
            "ServiceSetting.serviceType": serviceType,
            "ServiceSetting.service.serviceName": serviceName
        },
        function (err, model) {
            //show the type document row []
            var foundTypeRow;
            var foundNameRow;
            for (var x = 0; x < model.ServiceSetting.length; x++) {
                if (model.ServiceSetting[x].serviceType == serviceType) {
                    foundTypeRow = x;
                }
            }
            for (var y = 0; y < model.ServiceSetting[foundTypeRow].service.length; y++) {
                if (model.ServiceSetting[foundTypeRow].service[y].serviceName == serviceName) {
                    foundNameRow = y;
                }
            }

            var hide = "ServiceSetting." + foundTypeRow + ".service." + foundNameRow + ".serviceHide";
            var update = {};
            update[hide] = serviceHide;

            //console.log(update);

            MemberModel.findOneAndUpdate({username: 'mv740'},
                update,
                function (err) {
                    console.log("test" + err);
                });
        });

    res.end();
};

exports.createAccount = function (MemberModel, req, res) {
    var username = req.body.username;
    var pass = req.body.password;

    MemberModel.findOne({'username': username}, function (error, result) {
        console.log(result);
        if (result === null) {
            var newMember = new MemberModel(
                {
                    "username": username,
                    "password": pass
                }
            );
            newMember.save(function (error, newAccount) {
                if (error) {
                    return console.error(error);
                }
            });
            res.send({'msg': 'created user ' + username})
        } else
            res.send({'error': 'this user already exist!'})

    })
};