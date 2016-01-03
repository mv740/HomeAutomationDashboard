/**
 * Created by micha on 10/24/2015.
 */
(function () {
    'use strict';

    angular
        .module('Dashboard')
        .factory('SessionService', SessionService);

    function SessionService() {
        return {
            user: null,
            authenticated: false
        };
    }
})();