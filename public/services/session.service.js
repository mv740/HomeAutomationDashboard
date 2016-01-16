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
        var cookie = 'session';

        session.default = {
            user: 'undefined',
            authenticated: false
        };

        session.start = function (username) {
            $rootScope.session.user = username;
            $rootScope.session.authenticated = true;
            $cookies.putObject(cookie, $rootScope.session);
        };

        session.get = function () {
            return $cookies.getObject(cookie) || session.default;
        };

        session.getUserName = function () {
            return $rootScope.session.user;
        };

        session.update = function (newUsername) {
            var session = $cookies.getObject(cookie);
            session.user = newUsername;
            $rootScope.session.user = newUsername;
            $cookies.putObject(cookie, session);
        };

        session.destroy = function () {
            $cookies.remove(cookie);
            $rootScope.session.user = 'undefined';
            $rootScope.session.authenticated = false;
            //delete $rootScope.session;
        };

        return session;
    }
})();