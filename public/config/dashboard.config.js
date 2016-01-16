/**
 * Created by micha on 10/18/2015.
 */

//todo not sure if i will keep it... need to read more about this
//var interceptor = function ($q, $injector) {
//    return {
//        request: function (config) {
//            console.log(config);
//            return config;
//        },
//
//        response: function (result) {
//            console.log(result);
//            return result;
//        },
//
//        responseError: function (rejection) {
//            console.log('Failed with', rejection.status, 'status');
//            if (rejection.status == 403) {
//                console.error(rejection.status);
//                // $state.go('/login');
//                $injector.get('$state').go('/login')
//            }
//            return $q.reject(rejection);
//        }
//
//    }
//
//};

(function () {
    'use strict';
    angular
        .module('Dashboard')
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

    function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        // $httpProvider.interceptors.push(interceptor);

        $urlRouterProvider.otherwise('/home');
        //routing
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'public/views/partials/home.html',
                authenticate: false
            })
            .state('services', {
                url: '/services',
                templateUrl: 'public/views/partials/services.html',
                authenticate: true,
                controller: 'ServicesController as ctrl'
            })
            .state('demo', {
                url: '/demo',
                templateUrl: 'public/views/demo.html',
                authenticate: true
            })
            .state('login', {
                url: '/login',
                templateUrl: '/public/views/partials/login.html',
                authenticate: false,
                controller: "LoginController as ctrl"
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'public/views/partials/forgot.html',
                authenticate: false,
                controller: "ResetController as ctrl"
            })
            .state('register', {
                url: '/register',
                templateUrl: 'public/views/partials/register.html',
                authenticate: false,
                controller: 'RegisterController as ctrl'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'public/views/partials/account.html',
                authenticate: true,
                controller: "AccountController as ctrl"
            })
            .state('reset', {
                url: '/reset',
                templateUrl: 'public/views/partials/reset-password.html',
                authenticate: false,
                controller: "ResetController as ctrl"
            })
            .state('service/setting', {
            url: '/service/setting',
            templateUrl: 'public/views/partials/services-setting.html',
            authenticate: false
            //controller: ""
        });

        $locationProvider.html5Mode(true);
    }

    run.$inject = ['$rootScope', '$state', 'AuthenticationService','SessionService'];
    function run($rootScope, $state, AuthenticationService, SessionService) {
        $rootScope.session = SessionService.get();

        $rootScope.$on("$stateChangeStart",
            function (event, toState, toParams, fromState, fromParams) {
                if (toState.authenticate && !AuthenticationService.isAuthenticated()) {
                    $state.go("login");
                    event.preventDefault();
                }
            });
    }
})();