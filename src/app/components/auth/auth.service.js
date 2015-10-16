(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth ($firebaseAuth, FirebaseRef, $q, $timeout, $state) {
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
      return FirebaseAuth.$authWithPassword({
        email: email,
        password: pass
      }, {
        rememberMe: rememberMe
      });
    }

    function logout () {
      FirebaseAuth.$unauth();
      $state.transitionTo('auth');
    }

    function createAccount (email, pass) {
      return $q(function (resolve, reject) {
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
        }).then(createProfile).then(resolve, reject);

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
      });
    }

    function resetPassword (email) {
      return FirebaseAuth.$resetPassword({
        email: email
      });
    }

    function changePassword (email, oldPass, newPass) {
      return FirebaseAuth.$changePassword({
        email: email,
        oldPassword: oldPass,
        newPassword: newPass
      });
    }

  }
})();


