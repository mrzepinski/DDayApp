(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Voting', Voting);

  /** @ngInject */
  function Voting (FirebaseRef, $firebaseObject) {

    var DEFAULT_NUMBER_OF_VOTES_FOR_PROJECT = 2,
      votes = $firebaseObject(FirebaseRef.votes);

    return {
      all: all,
      hasVotingRights: hasVotingRights,
      getAvailableVotesForProject: getAvailableVotesForProject
    };

    function all () {
      return votes;
    }

    function hasVotingRights (user) {
      return user.projectId;
    }

    function getAvailableVotesForProject () {
      return DEFAULT_NUMBER_OF_VOTES_FOR_PROJECT;
    }

  }
})();


