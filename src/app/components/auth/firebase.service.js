(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('FirebaseRef', FirebaseRef);

  /** @ngInject */
  function FirebaseRef ($window, FIREBASE_URL) {
    return new $window.Firebase(FIREBASE_URL);
  }
})();
