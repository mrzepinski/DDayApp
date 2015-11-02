(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Vote', Vote);

  /** @ngInject */
  function Vote (FirebaseRef, $firebaseUtils, $firebaseArray, $firebaseObject, $q) {

    var votes = $firebaseArray(FirebaseRef.votes);

    return {
      add: add,
      all: all,
      findById: findById
    };

    function add (data) {
      return $q(function (resolve, reject) {
        all().$add(data).then(function (ref) {
          resolve($firebaseUtils.getKey(ref));
        }, reject);
      });
    }

    function all () {
      return votes;
    }

    function findById (id) {
      return $firebaseObject(FirebaseRef.voteById(id));
    }

  }
})();


