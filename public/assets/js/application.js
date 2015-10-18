/**
 * Created by micha on 9/7/2015.
 */

(function () {
    'use strict';
    angular.module('Dashboard', ['ui.router'])
    .config(['$stateProvider','$urlRouterProvider',"$locationProvider",function($stateProvider, $urlRouterProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/home');


        $stateProvider
            //Home State
            .state('home', {
                url: '/home',
                templateUrl: '/public/partial-home.html'
            })
            // Service State
            .state('service', {
                url: '/service',
                templateUrl: '/public/partial-service.html'
            })
            .state('demo', {
                url: '/demo',
                templateUrl: '/public/demo.html'
            })
    }])
})();



