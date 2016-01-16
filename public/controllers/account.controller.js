/**
 * Created by micha on 12/23/2015.
 */
/**
 * Created by micha on 9/22/2015.
 */

(function () {
    'use strict';

    angular
        .module('Dashboard')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['AuthenticationService'];

    function AccountController(AuthenticationService) {
        var vm = this;
        vm.account = {
            username: AuthenticationService.getUserName()
        };

        vm.tabs = [{
            title: 'Change Username',
            url: 'public/views/partials/account-username.html'
        }, {
            title: 'Change Password',
            url: 'public/views/partials/account-password.html'
        }];

        vm.currentTab = 'public/views/partials/account-username.html';

        vm.onClickTab = function (tab) {
            vm.currentTab = tab.url;
        };

        vm.isActiveTab = function (tabUrl) {
            return tabUrl === vm.currentTab;
        };

        vm.activePanel = 'public/views/partials/account-username.html';

        vm.showPanel = function (url) {
            vm.activePanel = url;
        };

        vm.usernameUpdate = function (account) {
            AuthenticationService.account.usernameUpdate(account);
            vm.confirmShow.username.resultU = false;
        };

        vm.passwordUpdate = function (account) {
            AuthenticationService.account.passwordUpdate(account);
            vm.confirmShow.password.resultP = false;
            vm.account.password = null;
            vm.account.confirmPassword = null;
        };

        vm.confirmShow = {
            password: {
                resultP: false
            },
            username: {
                resultU: false
            }
        };

        vm.confirm = function (data) {
            if(data.hasOwnProperty('resultP')){
                vm.confirmShow.password.resultP = true;
            }
            if(data.hasOwnProperty('resultU'))
            {
                vm.confirmShow.username.resultU = true;
            }
        };

        vm.cancel = function (data) {
            if(data.hasOwnProperty('resultP')){
                vm.confirmShow.password.resultP = false;
            }
            if(data.hasOwnProperty('resultU'))
            {
                vm.confirmShow.username.resultU = false;
            }
        };
    }
})();