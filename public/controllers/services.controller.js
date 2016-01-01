/**
 * Created by michal on 9/14/2015.
 */


(function () {
    'use strict';

    angular.module('Dashboard')
        .controller('ServicesController', ServicesController);

    ServicesController.$inject = ['$http', '$timeout'];

    function ServicesController($http, $timeout) {
        //vm = views models
        var vm = this;

        vm.table = [];
        vm.formAddService = {};
        vm.serviceTypeOption = null;

        vm.loadServiceViewTable = loadServiceViewTable;
        vm.loadTable = loadTable;
        vm.changeHide = changeHide;
        vm.addService = addService;
        vm.cancelEditService = cancelEditService;
        vm.startEditService = startEditService;
        vm.updateServiceTest = updateServiceTest;
        vm.deleteService = deleteService;


        vm.loadServiceViewTable();
        loadTable();
        vm.service = {};
        vm.serviceCurrent = {};

        function loadServiceViewTable() {
            $http.get('/listView/').
                then(function (response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //console.log((response.data));
                    vm.viewServices = response.data;
                });
        }
        function loadTable() {
            $http.get('/list/').
                then(function (response) {
                    vm.table = response.data;
                    vm.tableResult = response.data;
                    vm.status = "Loading";
                });
            $http.get('/api/list/serviceType')
                .then(function (response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log((response.data));
                    vm.serviceInfo = response.data;
                    vm.serviceTypeOption = vm.serviceInfo;
                });
        }
        function changeHide(service) {
            $http.post("/api/hideService", service)
                .success(function (data) {

                })
                .error(function (data) {
                    alert(data);
                });

        }
        function addService() {

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
                    vm.formAddService.$setPristine();
                    vm.formAddService.$setUntouched();
                    vm.service = {};
                    angular.element('div.input-control.full-size').removeClass('.success');
                })
                .error(function (data) {
                    alert(data);
                });
        }
        function cancelEditService(service, index) {
            service.serviceName = vm.serviceCurrent[index].serviceName;
            service.serviceType = vm.serviceCurrent[index].serviceType;
            service.editMode = false;
            delete vm.serviceCurrent[index];


        }
        function startEditService(service, index) {
            vm.serviceCurrent[index] = angular.copy(service);
            service.editMode = true;

        }
        function updateServiceTest(service, index) {
            var newService = {
                service: {
                    newType: service.serviceType,
                    newName: service.serviceName,
                    type: vm.serviceCurrent[index].serviceType,
                    name: vm.serviceCurrent[index].serviceName

                }
            };
            $http.post("/api/updateService", newService)
                .success(function (data) {
                    service.editMode = false;
                })
                .error(function (data) {
                    alert(data);
                });

            delete vm.serviceCurrent[index];
        }
        function deleteService(index, service) {
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
        }
    }
}());