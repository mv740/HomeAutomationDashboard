/**
 * Created by micha on 11/7/2015.
 */

(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('RegisterController', RegisterController);

    //RegisterController.$inject = ['AuthenticationService', '$cookies'];

    function RegisterController(AuthenticationService, $cookies) {
        var vm = this;

        vm.register = function()
        {
            //when register is done, log the user in

            //trigger success popup then login in
            AuthenticationService.login(data);
        };





    }

})();