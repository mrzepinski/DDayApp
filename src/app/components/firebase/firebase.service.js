(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('FirebaseRef', FirebaseRef);

  /** @ngInject */
  function FirebaseRef ($window, FIREBASE_URL) {
    var main = new $window.Firebase(FIREBASE_URL);
    var projects = new $window.Firebase([FIREBASE_URL, 'projects'].join('/'));

    return {
      main: main,
      userById: userById,
      projects: projects,
      projectById: projectById
    };

    function userById (id) {
      return new $window.Firebase([FIREBASE_URL, 'users', id].join('/'));
    }

    function projectById (id) {
      return new $window.Firebase([FIREBASE_URL, 'projects', id].join('/'));
    }

  }
})();
