(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('AccountController', AccountController);

  /** @ngInject */
  function AccountController (Auth, toastr) {
    var vm = this;

    vm.inProgress = true;

    Auth.getLoggedIn().then(function (loggedIn) {
      vm.loggedIn = loggedIn;
    }).finally(function () {
      vm.inProgress = false;
    });

    vm.newPassword = {
      oldPass: '',
      newPass: '',
      confirm: '',
      inProgress: false
    };

    vm.changePassword = changePassword;

    function changePassword () {
      toastr.clear();

      var oldPass = vm.newPassword.oldPass.trim();
      if (!oldPass) {
        toastr.warning('Your need to type current password!');
        return;
      }

      var newPass = vm.newPassword.newPass.trim();
      if (!newPass) {
        toastr.warning('What is your new password?');
        return;
      }

      var confirm = vm.newPassword.confirm.trim();
      if (newPass !== confirm) {
        toastr.warning('Passwords does not match!');
        return;
      }

      vm.newPassword.inProgress = true;

      Auth.changePassword(vm.loggedIn.password.email, oldPass, newPass).then(function () {
        vm.newPassword.oldPass = '';
        vm.newPassword.newPass = '';
        vm.newPassword.confirm = '';
        toastr.success('Your password has been changed.');
      }, handleError).finally(function () {
        vm.newPassword.inProgress = false;
      });
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
