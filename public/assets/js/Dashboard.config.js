/**
 * Created by micha on 10/18/2015.
 */
(function()
{
    'use strict';
    angular
        .module('Dashboard')
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/home');


        $stateProvider
            //Home State
            .state('home', {
                url: '/home',
                templateUrl: '/public/partial-home.html',
                authenticate: false
            })
            // Service State
            .state('service', {
                url: '/service',
                templateUrl: '/public/partial-service.html',
                authenticate: true
            })
            .state('demo', {
                url: '/demo',
                templateUrl: '/public/demo.html',
                authenticate: false
            })
            .state('login', {
                url: '/login',
                templateUrl: '/public/partial-login.html',
                authenticate: false
            })
    }

                    //['$rootScope', '$state', 'AuthenticationService'];
    //add AuthenticationService when service will be create later on
    run.$inject = ['$rootScope', '$state', 'AuthenticationService', '$cookieStore','$cookies'];
    function run($rootScope, $state, AuthenticationService, $cookieStore, $cookies) {

        $rootScope.globals = $cookies.getObject('globals');

        $rootScope.$on("$stateChangeStart",
            function (event, toState, toParams, fromState, fromParams) {
                if (toState.authenticate && !AuthenticationService.isAuthenticated()) {
                    $state.go("login");
                    event.preventDefault();
                }
            })
    }
    //continue authentication coding http://jasonwatmore.com/post/2014/05/26/AngularJS-Basic-HTTP-Authentication-Example.aspx

})();