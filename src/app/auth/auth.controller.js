(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController (Auth, $state, toastr) {
    var vm = this;

    vm.login = {
      email: '',
      pass: '',
      rememberMe: false,
      inProgress: false,
      action: login
    };

    vm.createAccount = {
      email: '',
      pass: '',
      confirm: '',
      inProgress: false,
      action: createAccount
    };

    vm.resetPassword = {
      email: '',
      inProgress: false,
      action: resetPassword
    };

    function login () {
      toastr.clear();
      vm.login.inProgress = true;

      Auth.login(vm.login.email, vm.login.pass, vm.login.rememberMe).then(function () {
        vm.login.email = '';
        vm.login.pass = '';
        vm.login.rememberMe = false;
        $state.transitionTo('account');
      }, handleError).finally(function () {
        vm.login.inProgress = false;
      });
    }

    function createAccount () {
      toastr.clear();
      if (vm.createAccount.pass !== vm.createAccount.confirm) {
        toastr.error('Passwords does not match!');
        return;
      }

      vm.createAccount.inProgress = true;

      Auth.createAccount(vm.createAccount.email, vm.createAccount.pass).then(function () {
        vm.createAccount.email = '';
        vm.createAccount.pass = '';
        vm.createAccount.confirm = '';
        toastr.success('Your account has been created.');
        $state.transitionTo('account');
      }, handleError).finally(function () {
        vm.createAccount.inProgress = false;
      });
    }

    function resetPassword () {
      toastr.clear();
      vm.resetPassword.inProgress = true;

      Auth.resetPassword(vm.resetPassword.email).then(function () {
        vm.resetPassword.email = '';
        toastr.success('Check your inbox!');
      }, handleError).finally(function () {
        vm.resetPassword.inProgress = false;
      });
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
