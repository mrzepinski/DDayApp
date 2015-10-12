(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController (Auth) {
    var ctrl = this;

    ctrl.data = {
      email: '',
      pass: '',
      rememberMe: false
    };
    ctrl.login = login;

    function login () {
    }
  }
})();
