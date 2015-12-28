/**
 * Created by micha on 10/24/2015.
 */
(function () {
    'use strict';

    angular
        .module('Dashboard')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', 'SessionService', '$location', '$rootScope', '$cookies', 'ngNotify'];

    function AuthenticationService($http, SessionService, $location, $rootScope, $cookies, ngNotify) {

        var authService = {};

        function failedAuthNotification(){
            ngNotify.set('Authentication Failed, please try again!', {
                position: 'top',
                type : 'error'
            });
        }

        authService.login = function (data, resetForm) {
            //console.log(data);

            $http.post('/login', data)
                .success(function (info, status, headers, config) {
                    SessionService.authenticated = true;
                    SessionService.user = data.username;
                    //console.log(SessionService);

                    $rootScope.globals = SessionService;
                    $cookies.putObject('globals', SessionService);

                    //console.log(info);
                    $location.path("/demo");
                })

                .error(function (info, status, headers, config) {
                    SessionService.authenticated = false;
                    if(resetForm != null)
                    {
                        resetForm();
                    }
                    failedAuthNotification();
                })


        };
        authService.logout = function () {

            $http.get('/logout').success(function (info, status) {
                console.log(status);
                $cookies.remove("globals");
                delete $rootScope.globals;
                $cookies.remove("connect.sid"); //cookie api
                $location.path('/home')
            }).error(function (info, status) {
                console.log(status);
            });

        };


        authService.isAuthenticated = function () {
            var globalsExist = $cookies.getObject('globals');
            if (globalsExist) {
                return globalsExist.authenticated;
            }
            return false;
        };

        authService.getUserName = function () {
            return $rootScope.globals.user;
        };

        authService.register = function(){
          $http.post('')
        };

        return authService;


    }

})();