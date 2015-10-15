(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth ($firebaseAuth, FirebaseRef, $q, $timeout, $state, $log) {
    var FirebaseAuth = $firebaseAuth(FirebaseRef);

    return {
      isAuthenticated: isAuthenticated,
      getLoggedIn: getLoggedIn,
      login: login,
      logout: logout,
      createAccount: createAccount,
      resetPassword: resetPassword,
      changePassword: changePassword
    };

    function isAuthenticated () {
      return !!FirebaseAuth.$getAuth();
    }

    function getLoggedIn () {
      return FirebaseAuth.$requireAuth();
    }

    function login (email, pass, rememberMe) {
      FirebaseAuth.$authWithPassword({
        email: email,
        password: pass
      }, {
        rememberMe: rememberMe
      }).then(redirectToHome, handleErrror);
    }

    function logout () {
      FirebaseAuth.$unauth();
      $state.transitionTo('auth');
    }

    function createAccount (email, pass) {
      FirebaseAuth.$createUser({
        email: email,
        password: pass
      }).then(function () {
        return FirebaseAuth.$authWithPassword({
          email: email,
          password: pass
        }, {
          rememberMe: true
        });
      }).then(createProfile).then(redirectToHome, handleErrror);

      function createProfile (user) {
        var ref = FirebaseRef.child('users/' + user.uid);
        var def = $q.defer();
        ref.set({
          email: email,
          name: firstPartOfEmail(email)
        }, function (err) {
          $timeout(function () {
            if (err) {
              def.reject(err);
            } else {
              def.resolve(ref);
            }
          });
        });
        return def.promise;

        function firstPartOfEmail (email) {
          return email.substr(0, email.indexOf('@')) || '';
        }
      }
    }

    function resetPassword (email) {
      FirebaseAuth.$resetPassword({
        email: email
      }).then(redirectToHome, handleErrror);
    }

    function changePassword (email, oldPass, newPass) {
      FirebaseAuth.$changePassword({
        email: email,
        oldPassword: oldPass,
        newPassword: newPass
      }).then(function() {
        // TODO
        //$state.transitionTo('');
      }, handleErrror);
    }

    function redirectToHome () {
      $state.transitionTo('home');
    }

    function handleErrror (err) {
      // TODO
      $log.error(err);
    }
  }
})();


