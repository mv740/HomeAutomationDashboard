/**
 * Created by michal on 9/14/2015.
 */


(function () {
    'use strict';

    angular.module('Dashboard')
        .controller('Service', ['$http', '$timeout', function ($http, $timeout) {
            //vm = view model
            var vm = this;

            vm.table = [];
            vm.formAddService = {};
            vm.serviceTypeOption = null;


            vm.loadServiceViewTable = function()
            {
                $http.get('/api/listView/').
                    then(function (response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        //console.log((response.data));
                        vm.viewServices = response.data;
                    });
            };


            vm.loadTable = function () {
                $http.get('/api/list/').
                    then(function (response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        //console.log((response.data));
                        vm.table = response.data;
                        vm.tableResult = response.data;
                        console.log(vm.table);

                        vm.status = "Loading";
                    });
                $http.get('/api/list/serviceType').
                    then(function (response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log((response.data));
                        vm.serviceInfo = response.data;
                        vm.serviceTypeOption = vm.serviceInfo;
                        //default value
                        //vm.service.type = vm.serviceInfo[1].serviceType;
                    });


            };

            vm.loadServiceViewTable();
            vm.loadTable();

            vm.service = {};
            vm.serviceCurrent = {};


            vm.changeHide = function(service)
            {

                console.log(service);
                $http.post("/api/hideService", service)
                    .success(function(data) {

                    })
                    .error(function (data) {
                        alert(data);
                    });

            };

            vm.addService = function () {
                var newService = {
                    service: {
                        type: vm.service.type,
                        name: vm.service.name
                    }
                };
                var newServiceView = {
                    serviceType: vm.service.type,
                    serviceName: vm.service.name,
                    editMode: false
                };

                $http.post("/api/insertService", newService)
                    .success(function (data) {
                        vm.table.push(newServiceView);
                        //vm.loadTable();
                        vm.formAddService.$setPristine();
                        vm.formAddService.$setUntouched();
                        vm.service = {};
                        angular.element('div.input-control.full-size').removeClass('.success');
                    })
                    .error(function (data) {
                        alert(data);
                    });
            };

            vm.cancelEditService = function (service, index) {
                service.serviceName = vm.serviceCurrent[index].serviceName;
                service.serviceType = vm.serviceCurrent[index].serviceType;
                service.editMode = false;
                delete vm.serviceCurrent[index];


            };
            vm.startEditService = function (service, index) {
                vm.serviceCurrent[index] = angular.copy(service);
                service.editMode = true;

            };

            vm.updateServiceTest = function (service, index) {
                //console.log("update");
                console.log(service);
                alert(index);
                var newService = {
                    service: {
                        newType: service.serviceType,
                        newName: service.serviceName,
                        type: vm.serviceCurrent[index].serviceType,
                        name: vm.serviceCurrent[index].serviceName

                    }
                };
                delete vm.serviceCurrent[index];
                console.log(vm.serviceCurrent);
                $http.post("/api/updateService", newService)
                    .success(function(data) {
                        //vm.loadTable();
                        alert("test");
                        service.editMode = false;
                    })
                    .error(function (data) {
                        alert(data);
                    });


            };


            vm.deleteService = function (index, service) {
                var newService = {
                    service: {
                        type: service.serviceType,
                        name: service.serviceName
                    }
                };
                console.log(newService);

                $http.post("/api/deleteService", newService)
                    .success(function (data) {
                        vm.table.splice(index, 1);
                        //vm.loadTable();
                    })
                    .error(function (data) {
                        alert(data);
                    });
            };


        }])
        .directive('service', ['$interval', '$http', '$sce','$rootScope', function ($interval, $http, $sce, $rootScope) {
            return {
                restrict: 'E',
                scope: {
                    id: "@",
                    status: "@",
                    type: "@",
                    template: "@"
                },
                template: "<ng-include src='getTemplateUrl()'/>",
                replace: true,
                link: function update(scope) {
                    scope.callAtInterval = function () {
                        if (scope.type == 'prtg') {
                            $http.get('/api/customSensor/' + scope.id)
                                .then(function (response) {
                                    // this callback will be called asynchronously
                                    // when the response is available
                                    console.log((response.data));
                                    scope.test = response.data;
                                    //TODO need to divide into two controller one per service type
                                    if (scope.type == "prtg") {
                                        var status = response.data.prtg.sensors[0].status_raw;
                                    }
                                    scope.online = false;
                                    scope.offline = false;
                                    scope.warning = false;
                                    if (status == 3) {
                                        scope.status = "Online";
                                        scope.online = true;
                                    }
                                    if (status == 4) {
                                        scope.status = "Warning";
                                        scope.warning = true;
                                    }
                                    if (status == 5) {
                                        scope.status = "Offline";
                                        scope.offline = true;
                                    }
                                });
                        }
                        if (scope.type === 'particle') {
                            $http.get('/api/particle/temperature/' + scope.id)
                                .then(function (response) {
                                    // this callback will be called asynchronously
                                    // when the response is available
                                    console.log((response.data));
                                    scope.test = response.data;
                                    //TODO need to divide into two controller one per service type

                                    scope.temperature = (response.data.particule.temperature).toFixed(1) + " C";
                                    scope.online = true;
                                    scope.status = "Online";
                                });
                        }

                    };
                    //http://stackoverflow.com/questions/24324694/interval-function-continues-when-i-change-routes?lq=1
                    var dereg = $rootScope.$on('$locationChangeSuccess', function() {
                        $interval.cancel(scope.stop);
                        dereg();
                    });

                    scope.stop = $interval(function () {
                        scope.callAtInterval()
                    }, 5000);
                },
                controller: function ($scope) {
                    //function used on the ng-include to resolve the template
                    $scope.getTemplateUrl = function () {
                        //basic handling
                        if ($scope.type == "prtg")
                            return "public/prtg-service-template.html";
                        if ($scope.type == "particle")
                            return "public/particle-service-template.html";
                    }
                }


            }
        }])

}());