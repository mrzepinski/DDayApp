(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Settings', Settings);

  /** @ngInject */
  function Settings (FirebaseRef, $firebaseObject) {

    var settingsObject = $firebaseObject(FirebaseRef.settings);

    return {
      all: all
    };

    function all () {
      return settingsObject;
    }

  }
})();


