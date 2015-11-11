(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('FirebaseRef', FirebaseRef);

  /** @ngInject */
  function FirebaseRef ($window, FIREBASE_URL) {
    var main = new $window.Firebase(FIREBASE_URL);
    var projects = new $window.Firebase([FIREBASE_URL, 'projects'].join('/'));
    var votes = new $window.Firebase([FIREBASE_URL, 'votes'].join('/'));
    var settings = new $window.Firebase([FIREBASE_URL, 'settings'].join('/'));

    return {
      main: main,
      userById: userById,
      projects: projects,
      projectById: projectById,
      votes: votes,
      voteById: voteById,
      settings: settings
    };

    function userById (id) {
      return new $window.Firebase([FIREBASE_URL, 'users', id].join('/'));
    }

    function projectById (id) {
      return new $window.Firebase([FIREBASE_URL, 'projects', id].join('/'));
    }

    function voteById (id) {
      return new $window.Firebase([FIREBASE_URL, 'votes', id].join('/'));
    }

  }
})();
