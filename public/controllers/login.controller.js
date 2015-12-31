/**
 * Created by micha on 9/22/2015.
 */

(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthenticationService', '$cookies', 'ngNotify'];

    function LoginController(AuthenticationService, $cookies, ngNotify) {
        var vm = this;
        vm.error = false;

        function resetForm()
        {
            vm.error = true;
            vm.account = {};
        }

        vm.login = function (data) {
           AuthenticationService.login(data, resetForm);
        };

        vm.logout = function () {
            AuthenticationService.logout();
        }


    }

})();