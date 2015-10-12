(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth ($firebaseAuth, FirebaseRef) {
    var FirebaseAuth = $firebaseAuth(FirebaseRef);

    return {
      isAuthenticated: isAuthenticated,
      login: login,
      createAccount: createAccount
    };

    function isAuthenticated  () {
      return !!FirebaseAuth.$getAuth();
    }

    function login () {}

    function createAccount () {}
  }
})();


