(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController (Auth, $log) {
    var vm = this;

    vm.login = {
      email: '',
      pass: '',
      rememberMe: false,
      action: login
    };

    vm.createAccount = {
      email: '',
      pass: '',
      confirm: '',
      action: createAccount
    };

    vm.resetPassword = {
      email: '',
      action: resetPassword
    };

    function login () {
      Auth.login(vm.login.email, vm.login.pass, vm.login.rememberMe);
    }

    function createAccount () {
      if (vm.createAccount.pass !== vm.createAccount.confirm) {
        // TODO
        $log.error('Passwords does not match!');
        return;
      }

      Auth.createAccount(vm.createAccount.email, vm.createAccount.pass);
    }

    function resetPassword () {
      Auth.resetPassword(vm.resetPassword.email);
    }

  }
})();
