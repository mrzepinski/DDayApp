(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Voting', Voting);

  /** @ngInject */
  function Voting (FirebaseRef, $firebaseObject) {

    var votes = $firebaseObject(FirebaseRef.votes);

    return {
      all: all
    };

    function all () {
      return votes;
    }

  }
})();


