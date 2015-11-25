(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth ($firebaseAuth, $firebaseArray, $firebaseObject, FirebaseRef, $q, $timeout, $state) {
    var FirebaseAuth = $firebaseAuth(FirebaseRef.main),
      users = $firebaseArray(FirebaseRef.users);

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
      return $firebaseObject(FirebaseRef.userById(uid));
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

    function createAccount (email, pass, withLogin, userData) {
      return $q(function (resolve, reject) {
        FirebaseAuth.$createUser({
          email: email,
          password: pass
        })
        .then(function (user) {
          if (withLogin) {
            return login(email, pass, true);
          }
          return user;
        })
        .then(createProfile)
        .then(resolve, reject);

        function createProfile (user) {
          var ref = FirebaseRef.userById(user.uid);
          return $q(function (resolve, reject) {
            var userObj = {
              email: email,
              name: firstPartOfEmail(email)
            };
            if (userData) {
              userObj = angular.extend(userObj, userData);
            }
            ref.set(userObj, function (err) {
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


