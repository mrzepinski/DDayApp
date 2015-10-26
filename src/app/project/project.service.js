(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Project', Project);

  /** @ngInject */
  function Project (FirebaseRef, $firebaseUtils, $firebaseArray, $firebaseObject, $q) {

    var projects = $firebaseArray(FirebaseRef.projects);

    return {
      create: create,
      all: all,
      findById: findById
    };

    function create (data) {
      return $q(function (resolve, reject) {
        all().$add(data).then(function (ref) {
          resolve($firebaseUtils.getKey(ref));
        }, reject);
      });
    }

    function all () {
      return projects;
    }

    function findById (id) {
      return $firebaseObject(FirebaseRef.projectById(id));
    }

  }
})();


