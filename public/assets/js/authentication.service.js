/**
 * Created by micha on 10/24/2015.
 */
(function () {
    'use strict';

    angular
        .module('Dashboard')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', 'SessionService', '$location', '$rootScope', '$cookies'];

    function AuthenticationService($http, SessionService, $location, $rootScope, $cookies) {

        var authService = {};

        authService.login = function (data) {
            console.log(data);

            $http.post('/login', data)
                .success(function (info, status, headers, config) {
                    SessionService.authenticated = true;
                    SessionService.user = data.username;
                    console.log(SessionService);

                    $rootScope.globals = SessionService;
                    $cookies.putObject('globals', SessionService);

                    //console.log(info);
                    $location.path("/demo");
                })

                .error(function (info, status, headers, config) {
                    SessionService.authenticated = false;
                    console.log('Error Authenticating');
                    //console.log(info);
                })


        };
        authService.logout = function () {

            $http.get('/logout').success(function(info, status)
            {
                console.log(status);
                $cookies.remove("globals");
                delete $rootScope.globals;
                $cookies.remove("connect.sid"); //cookie api
                $location.path('/home')
            }).error(function(info, status){
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

        return authService;


    }

})();