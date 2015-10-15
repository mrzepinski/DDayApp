(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('AccountController', AccountController);

  /** @ngInject */
  function AccountController (Auth, FirebaseRef, $firebaseObject, $log) {
    var vm = this;

    Auth.getLoggedIn().then(function (loggedIn) {
      vm.loggedIn = loggedIn;
      vm.profile = $firebaseObject(FirebaseRef.child('users/' + vm.loggedIn.uid));
      $log.info(vm.loggedIn);
      $log.info(vm.profile);
    });

    vm.changePassword = {
      oldPass: '',
      newPass: '',
      confirm: '',
      action: changePassword
    };

    function changePassword () {
      if (vm.changePassword.newPass !== vm.changePassword.confirm) {
        // TODO
        $log.error('Passwords does not match!');
        return;
      }

      Auth.changePassword(vm.profile.email, vm.changePassword.oldPass, vm.changePassword.newPass);
    }
  }
})();
