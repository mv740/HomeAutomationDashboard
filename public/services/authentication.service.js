/**
 * Created by micha on 10/24/2015.
 */
(function () {
    'use strict';

    angular
        .module('Dashboard')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', 'SessionService', '$state', '$rootScope', '$cookies', 'ngNotify'];

    function AuthenticationService($http, SessionService, $state, $rootScope, $cookies, ngNotify) {

        var authService = {};

        function failedAuthNotification() {
            ngNotify.set('Authentication Failed, please try again!', {
                position: 'top',
                type: 'error'
            });
        }

        authService.login = function (data, resetForm) {
            $http.post('/login', data)
                .then(function success(response) {
                    SessionService.authenticated = true;
                    SessionService.user = data.username;
                    $rootScope.globals = SessionService;
                    $cookies.putObject('globals', SessionService);
                    $state.go("demo");
                }, function error(err) {
                    SessionService.authenticated = false;
                    if (resetForm !== null) {
                        resetForm();
                    }
                    failedAuthNotification();
                });
        };
        authService.logout = function () {
            $http.get('/logout')
                .then(function success(data) {
                    $cookies.remove("globals");
                    delete $rootScope.globals;
                    $cookies.remove("connect.sid"); //cookie api
                    $state.go('home');
                }, function error(err) {
                    console.error(err);
                });
        };

        authService.registration = function (data, notify) {
            $http.post('/account', data)
                .then(function success(response) {
                    //when register is done, log the user in
                    authService.login(data, null);
                }, function error(err) {
                    console.error(err);
                    if (err.data.status === 'duplicate username') {
                        notify.usernameExist();
                    } else if (err.data.status === 'duplicate email') {
                        notify.emailExist();
                    }
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

        authService.resetPassword = function (data, notification) {
            $http.post('/forgot', data)
                .then(function success(data) {
                    notification.success();
                }, function error(err) {
                    notification.fail();
                });
        };

        authService.saveResetPassword = function (data, notification) {
            $http.post('/reset', data)
                .then(function success(data) {
                    notification.success();
                }, function error(err) {
                    notification.fail();
                });
        };
        return authService;
    }

})();