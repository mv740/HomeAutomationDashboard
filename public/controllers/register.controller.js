/**
 * Created by micha on 11/7/2015.
 */

(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['AuthenticationService', '$cookies', 'ngNotify', '$http'];

    function RegisterController(AuthenticationService, $cookies, ngNotify, $http) {
        var vm = this;


        function passwordMatch() {
            return (vm.account.password == vm.account.passwordConfirmation)
        }

        function usernameExistNotify() {
            ngNotify.set('Sorry, that username is already taken!', {
                position: 'top',
                type: 'warn'
            });
        }

        function emailExistNotify() {
            ngNotify.set('Sorry, that email is already used!', {
                position: 'top',
                type: 'warn'
            });
        }

        function invalidEmailNotify() {
            ngNotify.set('please use a valid email!', {
                position: 'top',
                type: 'warn'
            });
        }

        function invalidEmail() {
            return vm.form.$error.email
        }

        function passwordError() {
            ngNotify.set('Password does not match the confirm password.', {
                position: 'top',
                type: 'warn'
            });
        }


        vm.register = function (data) {
            if (!passwordMatch()) {
                passwordError();
            } else if (invalidEmail()) {
                invalidEmailNotify();
            } else {
                $http.post('api/createAccount', data).success(function (info, status) {
                    //when register is done, log the user in
                    //trigger success popup then login in
                    AuthenticationService.login(data, null);
                }).error(function (data, status) {
                    //console.error(data);
                    if (data.status == 'duplicate username') {
                        usernameExist();
                    } else if (data.status == 'duplicate email') {
                        emailExistNotify();
                    }
                });


            }
        };


    }

})();