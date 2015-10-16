(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('AccountController', AccountController);

  /** @ngInject */
  function AccountController (Auth, FirebaseRef, $firebaseObject, toastr) {
    var vm = this;

    Auth.getLoggedIn().then(function (loggedIn) {
      vm.loggedIn = loggedIn;
      vm.profile = $firebaseObject(FirebaseRef.child('users/' + vm.loggedIn.uid));
    });

    vm.changePassword = {
      oldPass: '',
      newPass: '',
      confirm: '',
      inProgress: false,
      action: changePassword
    };

    function changePassword () {
      if (vm.changePassword.newPass !== vm.changePassword.confirm) {
        toastr.error('Passwords does not match!');
        return;
      }

      vm.changePassword.inProgress = true;
      toastr.clear();

      Auth.changePassword(vm.profile.email, vm.changePassword.oldPass, vm.changePassword.newPass).then(function () {
        vm.changePassword.oldPass = '';
        vm.changePassword.newPass = '';
        vm.changePassword.confirm = '';
        toastr.success('Your password has been changed.');
      }, handleError).finally(function () {
        vm.changePassword.inProgress = false;
      });
    }

    function handleError (error) {
      toastr.error(error.toString());
    }

  }
})();
