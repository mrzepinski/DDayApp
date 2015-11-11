(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Settings', Settings);

  /** @ngInject */
  function Settings (FirebaseRef, $firebaseObject) {

    return {
      all: all
    };

    function all () {
      return $firebaseObject(FirebaseRef.settings);
    }

  }
})();


