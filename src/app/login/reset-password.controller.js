(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('ResetPasswordController', ResetPasswordController);

  /** @ngInject */
  function ResetPasswordController (Auth) {
    var ctrl = this;

    ctrl.data = {
      email: ''
    };
    ctrl.resetPassword = resetPassword;

    function resetPassword () {
    }
  }
})();
