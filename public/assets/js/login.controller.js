/**
 * Created by micha on 9/22/2015.
 */

(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthenticationService', '$cookies'];

    function LoginController(AuthenticationService, $cookies) {
        var vm = this;

        //http://jasonwatmore.com/post/2014/05/26/AngularJS-Basic-HTTP-Authentication-Example.aspx

        vm.login = function (data) {
            //console.log("test");
            //console.log(data);
            AuthenticationService.login(data);

        };

        vm.submit = function (data) {
            AuthenticationService.login(data);
        };

        vm.logout = function()
        {
            console.log("TEST");
            AuthenticationService.logout();
        }



    }

})();