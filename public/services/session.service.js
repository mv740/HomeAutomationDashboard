/**
 * Created by micha on 10/24/2015.
 */
(function () {
    'use strict';

    angular
        .module('Dashboard')
        .factory('SessionService', SessionService);

    SessionService.$inject = ['$cookies', '$rootScope'];

    function SessionService($cookies, $rootScope) {

        var session = {};
        var cookie = "globals";

        session.create = function (username) {
            var session = {
                user: username,
                authenticated: true
            };
            $rootScope.globals = session;
            $cookies.putObject(cookie, session);
        };

        session.get = function () {
            return $cookies.getObject(cookie);
        };

        session.update = function (newUsername) {
            var session = $cookies.getObject(cookie);
            session.user = newUsername;
            $rootScope.globals.user = newUsername;
            $cookies.putObject(cookie, session);
        };

        session.destroy = function () {
            $cookies.remove(cookie);
            delete $rootScope.globals;
        };

        return session;
    }
})();