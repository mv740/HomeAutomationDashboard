/**
 * Created by micha on 9/7/2015.
 */

(function () {
    angular
        .module('Dashboard')
        .directive('service', service);

    service.$inject = ['$interval', '$http', '$rootScope'];
    function service() {
        return {
            restrict: 'E',
            scope: {
                id: "@",
                status: "@",
                type: "@",
                template: "@"
            },
            template: '<div><ng-include src=\"vm.getTemplateUrl()"/></div>',
            replace: true,
            controller: serviceController,
            controllerAs: 'vm',
            bindToController: true // because scope vm is isolated
        };
    }

    function serviceController($interval, $http, $rootScope) {
        var vm = this;

        //function used on the ng-include to resolve the template
        vm.getTemplateUrl = getTemplateUrl;

        function getTemplateUrl() {
            //basic handling
            if (vm.type == "prtg")
                return "/public/views/partials/prtg-service-template.html";
            if (vm.type == "particle")
                return "/public/views/partials/particle-service-template.html";
        }

        update();

        function update() {
            vm.callAtInterval = function () {
                if (vm.type == 'prtg') {
                    $http.get('/api/customSensor/' + vm.id)
                        .then(function (response) {
                            // this callback will be called asynchronously
                            // when the response is available
                            console.log((response.data));
                            vm.test = response.data;
                            //TODO need to divide into two controller one per service type
                            if (vm.type == "prtg") {
                                if(response.data.error)
                                {
                                    vm.status = "Warning";
                                    vm.warning = true;

                                }else {
                                    var status = response.data.prtg.sensors[0].status_raw;

                                    vm.online = false;
                                    vm.offline = false;
                                    vm.warning = false;
                                    if (status == 3) {
                                        vm.status = "Online";
                                        vm.online = true;
                                    }
                                    if (status == 4) {
                                        vm.status = "Warning";
                                        vm.warning = true;
                                    }
                                    if (status == 5) {
                                        vm.status = "Offline";
                                        vm.offline = true;
                                    }
                                }

                            }

                        });
                }
                if (vm.type === 'particle') {
                    $http.get('/api/particle/temperature/' + vm.id)
                        .then(function (response) {
                            // this callback will be called asynchronously
                            // when the response is available
                            console.log((response.data));
                            vm.test = response.data;
                            //TODO need to divide into two controller one per service type

                            vm.temperature = (response.data.particule.temperature).toFixed(1) + " C";
                            vm.online = true;
                            vm.status = "Online";
                        });
                }

            };
            //http://stackoverflow.com/questions/24324694/interval-function-continues-when-i-change-routes?lq=1
            var dereg = $rootScope.$on('$locationChangeSuccess', function () {
                $interval.cancel(vm.stop);
                dereg();
            });

            vm.stop = $interval(function () {
                vm.callAtInterval()
            }, 5000);
        }
    }
})();

