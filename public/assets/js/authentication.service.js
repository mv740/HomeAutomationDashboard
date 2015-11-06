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
            $cookies.remove('globals');
            $cookies.remove('connect-sid'); //cookie api
            delete $rootScope.globals;
            $location.path('/home')
        };


        authService.isAuthenticated = function () {
            if ($rootScope.globals.authenticated != undefined)
                return $rootScope.globals.authenticated;
            return false;
        };

        return authService;


    }

})();