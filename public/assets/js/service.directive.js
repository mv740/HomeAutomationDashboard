/**
 * Created by micha on 9/7/2015.
 */

(function () {
    angular
        .module('Dashboard')
        .directive('service', service);

    service.$inject = ['$interval', '$http', '$rootScope'];
    function service($interval, $http, $rootScope) {
        var directive =
        {
            restrict: 'E',
            scope: {
                id: "@",
                status: "@",
                type: "@",
                template: "@"
            },
            template: '<div><ng-include src=\"vm.getTemplateUrl()"/></div>',
            replace: true,
            link: update,
            controller: serviceController,
            controllerAs: 'vm',
            bindToController: true // because scope.vm is isolated


        };

        return directive;

        function update(scope) {
            scope.vm.callAtInterval = function () {
                if (scope.vm.type == 'prtg') {
                    $http.get('/api/customSensor/' + scope.vm.id, function (request, response) {
                            var tag = request.params.tag;
                            particle.getTemperature(tag, function (value) {
                                response.send(value);
                            });
                        })
                        .then(function (response) {
                            // this callback will be called asynchronously
                            // when the response is available
                            console.log((response.data));
                            scope.vm.test = response.data;
                            //TODO need to divide into two controller one per service type
                            if (scope.vm.type == "prtg") {
                                var status = response.data.prtg.sensors[0].status_raw;
                            }
                            scope.vm.online = false;
                            scope.vm.offline = false;
                            scope.vm.warning = false;
                            if (status == 3) {
                                scope.vm.status = "Online";
                                scope.vm.online = true;
                            }
                            if (status == 4) {
                                scope.vm.status = "Warning";
                                scope.vm.warning = true;
                            }
                            if (status == 5) {
                                scope.vm.status = "Offline";
                                scope.vm.offline = true;
                            }
                        });
                }
                if (scope.vm.type === 'particle') {
                    $http.get('/api/particle/temperature/' + scope.vm.id, function (request, response) {
                            var tag = request.params.tag;
                            particle.getTemperature(tag, function (value) {
                                response.send(value);
                            });
                        })
                        .then(function (response) {
                            // this callback will be called asynchronously
                            // when the response is available
                            console.log((response.data));
                            scope.vm.test = response.data;
                            //TODO need to divide into two controller one per service type

                            scope.vm.temperature = (response.data.particule.temperature).toFixed(1) + " C";
                            scope.vm.online = true;
                            scope.vm.status = "Online";
                        });
                }

            };
            //http://stackoverflow.com/questions/24324694/interval-function-continues-when-i-change-routes?lq=1
            var dereg = $rootScope.$on('$locationChangeSuccess', function () {
                $interval.cancel(scope.vm.stop);
                dereg();
            });

            scope.vm.stop = $interval(function () {
                scope.vm.callAtInterval()
            }, 5000);
        }
    }

    function serviceController() {
        var vm = this;

        //function used on the ng-include to resolve the template
        vm.getTemplateUrl = getTemplateUrl;

        function getTemplateUrl() {
            //basic handling
            if (vm.type == "prtg")
                return "/public/prtg-service-template.html";
            if (vm.type == "particle")
                return "/public/particle-service-template.html";
        }


    }

})();

