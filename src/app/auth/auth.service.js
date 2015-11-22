(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth ($firebaseAuth, $firebaseArray, $firebaseObject, FirebaseRef, $q, $timeout, $state) {
    var FirebaseAuth = $firebaseAuth(FirebaseRef.main),
      users = $firebaseArray(FirebaseRef.users),
      profile = null;

    return {
      getUsers: getUsers,
      isAuthenticated: isAuthenticated,
      getLoggedIn: getLoggedIn,
      getLoggedInProfile: getLoggedInProfile,
      login: login,
      logout: logout,
      createAccount: createAccount,
      resetPassword: resetPassword,
      changePassword: changePassword
    };

    function getUsers () {
      return users;
    }

    function isAuthenticated () {
      return !!FirebaseAuth.$getAuth();
    }

    function getLoggedIn () {
      return FirebaseAuth.$requireAuth();
    }

    function getLoggedInProfile (uid) {
      if (!profile) {
        profile = $q(function (resolve, reject) {
          $firebaseObject(FirebaseRef.userById(uid)).$loaded(resolve, reject);
        });
      }
      return profile;
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
          var ref = FirebaseRef.userById(user.uid);

          return $q(function (resolve, reject) {
            ref.set({
              email: email,
              name: firstPartOfEmail(email)
            }, function (err) {
              $timeout(function () {
                if (err) {
                  reject(err);
                } else {
                  resolve(ref);
                }
              });
            });
          });

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


