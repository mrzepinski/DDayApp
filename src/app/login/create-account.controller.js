(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('CreateAccountController', CreateAccountController);

  /** @ngInject */
  function CreateAccountController (Auth) {
    var ctrl = this;

    ctrl.data = {
      email: '',
      pass: '',
      confirm: ''
    };
    ctrl.createAccount = createAccount;

    function createAccount () {
    }
  }
})();
