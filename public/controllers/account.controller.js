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

    AccountController.$inject = ['AuthenticationService', '$cookies'];

    function AccountController(AuthenticationService) {
        var vm = this;
        vm.account = {
            username : AuthenticationService.getUserName()
        };

        vm.tabs = [{
            title: 'Change Username',
            url: 'public/account-username.html'
        }, {
            title: 'Change Password',
            url: 'public/account-password.html'
        }];

        vm.currentTab = 'public/account-username.html';

        vm.onClickTab = function (tab) {
            vm.currentTab = tab.url;
            console.log(tab);
        };

        vm.isActiveTab = function(tabUrl) {
            return tabUrl == vm.currentTab;
        };


        vm.items = [
            { title: 'Change username', url: 'public/account-username.html'},
            { title: 'Change password', url: 'public/account-password.html'}
        ];

        vm.activePanel = 'public/account-username.html';

        vm.showPanel = function(url) {
            vm.activePanel = url;
        }






    }

})();