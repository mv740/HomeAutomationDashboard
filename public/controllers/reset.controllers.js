/**
 * Created by Michal Wozniak on 12/29/2015.
 */
(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('ResetController', ResetController);

    ResetController.$inject = ['AuthenticationService', 'ngNotify', '$state'];

    function ResetController(AuthenticationService, ngNotify, $state) {
        var vm = this;

        var notify = {
            success: successNotify,
            fail: failedNotify
        };

        var notifyReset = {
            success: successResetNotify,
            fail: failedResetNotify
        };

        function successNotify() {
            ngNotify.set('An e-mail has been sent to ' + vm.account.email + ' with further instruction!', {
                position: 'top',
                type: 'success'
            });
        }

        function failedNotify() {
            ngNotify.set('No account with that email address exists!', {
                position: 'top',
                type: 'warn'
            });
        }

        function successResetNotify() {
            $state.go('login');

            ngNotify.set('Success! Your password has been changed.', {
                position: 'top',
                type: 'success'
            });
        }

        function failedResetNotify() {
            ngNotify.set('Password reset token is invalid or has expired!', {
                position: 'top',
                type: 'warn'
            });
        }

        function passwordError() {
            ngNotify.set('Password does not match the confirm password.', {
                position: 'top',
                type: 'warn'
            });
        }

        function passwordMatch() {
            return (vm.account.newPassword == vm.account.passwordConfirmation)
        }

        vm.resetPassword = function (data) {
            console.info(data);
            AuthenticationService.resetPassword(data, notify);
        };

        vm.savePassword = function (data) {
            if (!passwordMatch()) {
                passwordError();
            } else
                console.log(data);
            AuthenticationService.saveResetPassword(data, notifyReset);
        }
    }
})();