/**
 * Created by micha on 11/7/2015.
 */

(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['AuthenticationService', '$cookies','ngNotify','$http'];

    function RegisterController(AuthenticationService, $cookies,ngNotify, $http) {
        var vm = this;


        function passwordMatch()
        {
            return (vm.account.password == vm.account.passwordConfirmation)
        }

        function usernameExist()
        {
            ngNotify.set('Sorry, that username is already taken!', {
                position: 'top',
                type : 'warn'
            });
        }
        function emailExist()
        {
            ngNotify.set('Sorry, that email is already used!', {
                position: 'top',
                type : 'warn'
            });
        }

        vm.register = function(data)
        {
            if(!passwordMatch())
            {
                ngNotify.set('Password does not match the confirm password.', {
                    position: 'top',
                    type : 'warn'
                });
            }else
            {
                $http.post('api/createAccount', data).success(function (info, status) {
                    //when register is done, log the user in
                    //trigger success popup then login in
                    AuthenticationService.login(data,null);
                }).error(function (data, status) {
                    //console.error(data);
                    if(data.status == 'duplicate username')
                    {
                        usernameExist();
                    }else if(data.status == 'duplicate email')
                    {
                        emailExist();
                    }
                });



            }
        };





    }

})();