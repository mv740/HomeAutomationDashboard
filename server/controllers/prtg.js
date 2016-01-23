/**
 * @author Michal Wozniak
 * @summary PRTG API WRAPPER.
 * @version beta
 */

'use strict';
var needle = require('needle');

//todo : replace config file by querying database for user id/pass
var config = require('./../config/prtgConfig');

var errorMessage;

//http://www.peterbe.com/plog/isint-function
function isInt(x) {
    var y = parseInt(x, 10);
    return !isNaN(y) && x === y && x.toString() === y.toString();
}

/**
 * Get live details about the specified sensor (id)
 * @param {int} id - The id must be a integer
 * @param callback
 * @return {JSON} Object
 */
exports.getSensorDetails = function (id, callback) {

    if (isInt(id)) {
        needle.get(config.host + '/api/getsensordetails.json?id=' + id + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
            if (!error && response.statusCode === 200) {
                if ((response.body.sensordata.name.length !== 0) && (response.body.sensordata.sensortype !== "(Object not found)")) {
                    return callback({'prtg':response.body});
                } else {
                    errorMessage = {
                        'error': {
                            "functionName": "getSensorDetails",
                            "id": id,
                            "message": "Sensor not Found",
                            "statusCode": response.statusCode
                        }
                    };
                    return callback(errorMessage);
                }
            } else {
                errorMessage = {
                    "error": {
                        "functionName": "getSensorDetails",
                        "id": id,
                        "message": "Status Code error",
                        "statusCode": response.statusCode
                    }

                };
                return callback(errorMessage);
            }
        });
    } else {
        errorMessage = {
            "error": {
                "functionName": "getSensorDetails",
                "id": id,
                "message": "Id must be a integer"
            }
        };
        return callback(errorMessage);
    }
};


/**
 * Show the logged in users on a specific computer ( sensor ID required)
 *
 * @param {int} id
 * @param callback
 * @return {JSON} Object
 */
exports.getLoggedUsers = function (id, callback) {

    if (isInt(id)) {
        needle.get(config.host + '/api/getsensordetails.json?id=' + id + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
            if (!error && response.statusCode === 200) {
                if ((response.body.sensordata.sensortype === "ptfloggedinusers")) {
                    var body = response.body;
                    //keep only username
                    if (parseInt(body.sensordata.lastvalue) >= 1) {
                        var user = body.sensordata.lastmessage.match(/User(.*) is/);
                        body.sensordata.lastmessage = user[1];
                    }
                    return callback({"prtg": body});
                } else {
                    errorMessage = {
                        "error": {
                            "functionName": "getLoggedUsers",
                            "id": id,
                            "message": "Sensor not Found",
                            "statusCode": response.statusCode
                        }
                    };
                    return callback(errorMessage);
                }
            } else {
                errorMessage = {
                    "error": {
                        "functionName": "getLoggedUsers",
                        "id": id,
                        "message": "Status Code error",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        });
    } else {
        errorMessage = {
            "error": {
                "functionName": "getLoggedUsers",
                "id": id,
                "message": "Id must be a integer"
            }
        };
        return callback(errorMessage);
    }
};

/**
 * lightweight option to get status data like number of alarms, messages, etc.:
 * @param callback
 * @return {JSON} Object
 */
exports.getSystemStatus = function (callback) {
    // prtg system is aways sensor id=>0
    needle.get(config.host + '/api/getstatus.htm?id=0&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            return callback({"prtg": JSON.parse(response.body)});
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getSystemStatus",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }
            };
            return callback(errorMessage);
        }
    });
};


/**
 * get all the sensors of a device
 * @param {string} tag Device is identified by a unique tag
 * @param callback
 * @return {JSON} Object
 */
exports.getDevice = function (tag, callback) {

    needle.get(config.host + '/api/table.json?content=sensors&output=json&columns=objid,device,sensor,status,lastvalue,tags&filter_tags=' + tag + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            if (response.body.treesize > 0) {
                return callback({"prtg": response.body});
            } else {
                errorMessage = {
                    "error": {
                        "functionName": "getDevice",
                        "tag": tag,
                        "message": "Device not Found",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getDevice",
                    "tag": tag,
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }
            };
            return callback(errorMessage);
        }
    });
};

/**
 * A Device can contains multiple sensors. Display the sensor that is using the memory tag
 *  ATTENTION : only one memory tag per device MAX!
 * @param {int} id
 * @param callback
 * @return {JSON} Object
 */
exports.getMemory = function (id, callback) {

    if (isInt(id)) {
        //memory tag
        needle.get(config.host + '/api/table.json?content=sensors&output=json&columns=objid,probe,group,device,sensor,status,message,lastvalue,priority,favorite,tags&id=' + id + '&filter_tags=memorysensor&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
            if (!error && response.statusCode === 200) {
                if (response.body.treesize > 0) {
                    var prtg = {"prtg": response.body};
                    return callback(prtg);
                } else {
                    errorMessage = {
                        "error": {
                            "functionName": "getMemory",
                            "id": id,
                            "message": "This device has no memory sensor ",
                            "statusCode": response.statusCode
                        }
                    };
                    return callback(errorMessage);
                }
            } else {
                errorMessage = {
                    "error": {
                        "functionName": "getMemory",
                        "id": id,
                        "message": "Status Code error",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        });
    } else {
        errorMessage = {
            "error": {
                "functionName": "getMemory",
                "id": id,
                "message": "Id must be a integer"
            }
        };
        return callback(errorMessage);
    }

};

/**
 *  A Device can contains multiple sensors. Display the sensor that is using the cpuloadsensor tag
 *  ATTENTION : only one cpuloadsensor tag per device MAX!
 * @param {int} id
 * @param callback
 * @return {JSON} Object
 */
exports.getCPU = function (id, callback) {
    if (isInt(id)) {
        needle.get(config.host + '/api/table.json?content=sensors&output=json&columns=objid,device,sensor,status,lastvalue,tags&filter_tags=cpuloadsensor&id=' + id + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
            if (!error && response.statusCode === 200) {
                if (response.body.treesize > 0) {
                    var prtg = {"prtg": response.body};
                    return callback(prtg);
                } else {
                    errorMessage = {
                        "error": {
                            "functionName": "getCPU",
                            "id": id,
                            "message": "This device has no cpu sensor ",
                            "statusCode": response.statusCode
                        }
                    };
                    return callback(errorMessage);
                }
            } else {
                errorMessage = {
                    "error": {
                        "functionName": "getCPU",
                        "id": id,
                        "message": "Status Code error",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        });
    } else {
        errorMessage = {
            "error": {
                "functionName": "getCPU",
                "id": id,
                "message": "Id must be a integer"
            }
        };
        return callback(errorMessage);
    }
};

/**
 *  A Device can contains multiple sensors. Display the sensor that is using the getDisk tag
 *  ATTENTION : only one getDisk tag per device MAX!
 * @param {int} id
 * @param callback
 * @return {JSON} Object
 */
exports.getDisk = function (id, callback) {
    if (isInt(id)){
        needle.get(config.host + '/api/table.json?content=sensors&output=json&columns=objid,device,sensor,status,lastvalue,tags&filter_tags=diskspacesensor&id=' + id + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
            if (!error && response.statusCode === 200) {
                if (response.body.treesize > 0) {
                    var prtg = {"prtg": response.body};
                    return callback(prtg);
                } else {
                    errorMessage = {
                        "error": {
                            "functionName": "getDisk",
                            "id": id,
                            "message": "This device has no disk sensor ",
                            "statusCode": response.statusCode
                        }
                    };
                    return callback(errorMessage);
                }
            } else {
                errorMessage = {
                    "error": {
                        "functionName": "getDisk",
                        "id": id,
                        "message": "Status Code error",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        });

    }else {
        errorMessage = {
            "error": {
                "functionName": "getDisk",
                "id": id,
                "message": "Id must be a integer"
            }
        };
        return callback(errorMessage);
    }
};

/**
 * Get the log messages
 * @param {int} limit Number of logs that will appear
 * @param {int} maxMessageLenght limit the length of log message
 * @param callback
 * @return {JSON} object
 */
exports.getLogs = function (limit, maxMessageLenght, callback) {

    limit = limit || ""; // specified limit or all of them
    maxMessageLenght = maxMessageLenght || 30;

    needle.get(config.host + '/api/table.json?content=messages&output=json&columns=objid,datetime,parent,type,name,status,message&count=' + limit + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            if (response.body.treesize > 0) {

                var messages = response.body.messages;
                for (var message in messages) {
                    if ((messages[message].message_raw).length > maxMessageLenght) {
                        messages[message].message_raw = (messages[message].message_raw).substr(0, maxMessageLenght) + "...";
                    }
                }
                var prtg = {"prtg": {
                    "messages" : messages
                }};
                callback(prtg);
            } else {
                errorMessage = {
                    'error': {
                        "functionName": "getLogs",
                        "message": "Logs are empty",
                        "statusCode": response.statusCode
                    }
                };
                callback(errorMessage);
            }
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getLogs",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }

            };
            callback(errorMessage);
        }
    });

};


/**
 *All devices from one group
 * @param groupID
 * @param callback
 */
exports.getGroupDevices = function (groupID, callback) {

    needle.get(config.host + '/api/table.json?content=devices&columns=objid,probe,group,device&id=' + groupID + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            if (response.body.treesize > 0) {
                var prtg = {"prtg": response.body};
                return callback(prtg);
            } else {
                errorMessage = {
                    'error': {
                        "functionName": "getGroupDevices",
                        "message": "Groups is empty",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getGroupDevices",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }

            };
            return callback(errorMessage);
        }
    });

};

/**
 *List of all groups
 *
 * @param groupID
 * @param callback
 */
exports.getGroupList = function (callback) {

    needle.get(config.host + 'api/table.json?content=groups&output=json&columns=objid,probe,group,name,downsens,partialdownsens,downacksens,upsens,warnsens,pausedsens,unusualsens,undefinedsens&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            if (response.body.treesize > 0) {
                var prtg = {"prtg": response.body};
                return callback(prtg);
            } else {
                errorMessage = {
                    'error': {
                        "functionName": "getGroupList",
                        "message": "There isn't any groups",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getGroupList",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }

            };
            return callback(errorMessage);
        }
    });

};

/**
 * &filter_tags=wmiuptimesensor
 * @param id
 * @param callback
 */
exports.getUpTime = function (id, callback) {

    needle.get(config.host + '/api/table.json?content=sensors&output=json&columns=objid,device,sensor,status,lastvalue,tags&filter_tags=wmiuptimesensor&id=' + id + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            if (response.body.treesize > 0) {
                var prtg = {"prtg": response.body};
                return callback(prtg);
            } else {
                errorMessage = {
                    'error': {
                        "functionName": "getUpTime",
                        "message": "Logs are empty",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getUpTime",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }

            };
            return callback(errorMessage);
        }
    });
};
/**
 * pingsensor
 * @param id
 * @param callback
 */
exports.getPing = function (id, callback) {

    needle.get(config.host + '/api/table.json?content=sensors&output=json&columns=objid,device,sensor,status,lastvalue,tags&filter_tags=pingsensor&id=' + id + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            if (response.body.treesize > 0) {
                var prtg = {"prtg": response.body};
                return callback(prtg);
            } else {
                errorMessage = {
                    'error': {
                        "functionName": "getPing",
                        "message": "error...",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getPing",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }

            };
            return callback(errorMessage);
        }
    });
};

/**
 *
 * @param tag
 * @param callback
 */
exports.getCustomSensor = function (tag, callback) {

    needle.get(config.host + '/api/table.json?content=sensors&output=json&columns=objid,device,sensor,status,lastvalue,tags&filter_tags=' + tag + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            if (response.body.treesize > 0) {
                var prtg = {"prtg": response.body};
                return callback(prtg);
            } else {
                errorMessage = {
                    'error': {
                        "functionName": "getCustomSensor",
                        "tag": tag,
                        "message": "There doesn't exist a sensor with this custom tag",
                        "statusCode": response.statusCode
                    }
                };
                return callback(errorMessage);
            }
        } else {
            errorMessage = {
                "error": {
                    "functionName": "getCustomSensor",
                    "tag": tag,
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }

            };
            return callback(errorMessage);
        }
    });
};

/**
 *
 * @param id
 * @param hide
 * @param callback
 */
exports.getGraph = function (id, hide, callback) {
    var hideCorrected = "";
    if (typeof hide !== 'undefined') {
        //hideCorrected = hide.str_replace('.', ',');
        hideCorrected = hide.replace(/\./g, ',');
    }
    console.log(hideCorrected);
    needle.get(config.host + '/chart.svg?type=graph&graphid=0&graphstyling=baseFontSize%3D%2712%27&graphtitle=%40%40notitle%40%40&width=600&height=220&hide=' + hideCorrected + '&id=' + id + '&username=' + config.authentication.username + '&password=' + config.authentication.password, {rejectUnauthorized: false}, function (error, response) {
        if (!error && response.statusCode === 200) {
            return callback(response.body);

        } else {
            errorMessage = {
                "error": {
                    "functionName": "getCustomSensor",
                    "message": "Status Code error",
                    "statusCode": response.statusCode
                }

            };
            return callback(errorMessage);
        }
    });
};
