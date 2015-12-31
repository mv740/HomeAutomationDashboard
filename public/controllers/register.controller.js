/**
 * Created by micha on 11/7/2015.
 */

(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['AuthenticationService', 'ngNotify'];

    function RegisterController(AuthenticationService, ngNotify) {
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

        var notfiyError = {
            'usernameExist' : usernameExistNotify,
            'emailExist': emailExistNotify
        };

        vm.register = function (data) {
            if (!passwordMatch()) {
                passwordError();
            } else if (invalidEmail()) {
                invalidEmailNotify();
            } else {
                AuthenticationService.registration(data,notfiyError);
            }
        };


    }

})();