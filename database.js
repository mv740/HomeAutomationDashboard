/**
 * Created by michal on 10/21/2015.
 * Database queries
 */


exports.getServiceTypes = function (MemberModel, request, response) {
    MemberModel.findOne({username: request.user.username}, function (err, member) {

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
    var currentUser = req.user.username;

    var newService = {
        serviceName: req.body.service.name,
        serviceHide: false
    };
    //The $push operator appends a specified value to an array.
    MemberModel.findOneAndUpdate({username: currentUser, "ServiceSetting.serviceType": type},
        {$push: {"ServiceSetting.$.service": newService}},
        function (err, model) {
            console.log(err);
            //console.log(models);
        });
    res.end();
};

exports.updateService = function (MemberModel, req, res) {
    var newType = req.body.service.newType;
    var newServiceName = req.body.service.newName;
    var currentType = req.body.service.type;
    var currentServiceName = req.body.service.name;
    var currentUser = req.user.username;

    // type not changed, name changed
    if (newServiceName != currentServiceName && newType === currentType) {

        var query = {

            "username": currentUser,
            "ServiceSetting.serviceType": currentType,
            "ServiceSetting.service.serviceName": currentServiceName

        };
        MemberModel.findOne(query,
            function (err, model) {
                //show the type document row []
                var foundTypeRow;
                var foundNameRow;
                for (var x = 0; x < model.ServiceSetting.length; x++) {
                    if (model.ServiceSetting[x].serviceType == currentType) {
                        foundTypeRow = x;
                    }
                }
                for (var y = 0; y < model.ServiceSetting[foundTypeRow].service.length; y++) {
                    if (model.ServiceSetting[foundTypeRow].service[y].serviceName == currentServiceName) {
                        foundNameRow = y;
                    }
                }

                var nameQuery = "ServiceSetting." + foundTypeRow + ".service." + foundNameRow + ".serviceName";
                var update = {};
                update[nameQuery] = newServiceName;

                MemberModel.findOneAndUpdate({username: currentUser},
                    update,
                    function (err) {
                        console.log("updateService used");
                        if(err !=null)
                        {
                            console.log("updateService Error : " +err)
                        }
                    });

            });
        res.end();

    } else if (currentType != newType)
    {
        //delete old one
        var currentService = {
            serviceName: currentServiceName
        };
        //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
        MemberModel.findOneAndUpdate({
                username: currentUser,
                "ServiceSetting.serviceType": currentType,
                "ServiceSetting.service.serviceName": req.body.service.name
            },
            {$pull: {"ServiceSetting.$.service": currentService}},
            function (err, model) {
                console.log(err);
                //console.log(models);
            });

        //insert new one with new type and check if we need to update the service name
        var newService = {
            serviceName: (newServiceName == currentServiceName)?currentServiceName:newServiceName,
            serviceHide: false
        };
        //The $push operator appends a specified value to an array.
        MemberModel.findOneAndUpdate({username: currentUser, "ServiceSetting.serviceType": newType},
            {$push: {"ServiceSetting.$.service": newService}},
            function (err, model) {
                console.log("updateService used");
                if(err !=null)
                {
                    console.log("updateService Error : " +err)
                }

            });
        res.end();
    }else
    {
        //nothing to change
        res.end()
    }
};

exports.deleteService = function (MemberModel, req, res) {
    console.log(req.body);
    var type = req.body.service.type;
    var currentUser = req.user.username;

    var newService = {
        serviceName: req.body.service.name
    };
    //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    MemberModel.findOneAndUpdate({
            username: currentUser,
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
    var currentUser = req.user.username;

    //only name changed
    MemberModel.findOne({
            "username": currentUser,
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

            MemberModel.findOneAndUpdate({username: currentUser},
                update,
                function (err) {
                    console.log("hideServices used");
                    if(err !=null)
                    {
                        console.log("hideServices Error : " +err)
                    }
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

