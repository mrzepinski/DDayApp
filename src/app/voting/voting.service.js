(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Voting', Voting);

  /** @ngInject */
  function Voting (FirebaseRef, $firebaseObject) {

    var DEFAULT_NUMBER_OF_VOTES = 2,
      votes = $firebaseObject(FirebaseRef.votes);

    return {
      all: all,
      hasVotingRights: hasVotingRights,
      getAvailableVotesForRole: getAvailableVotesForRole
    };

    function all () {
      return votes;
    }

    function hasVotingRights (user) {
      return user.projectId || 'VIP' === user.role;
    }

    function getAvailableVotesForRole (role, projectsLength) {
      if (!role || 'VIP' !== role) {
        return DEFAULT_NUMBER_OF_VOTES;
      }
      return calculateNumberOfVotesForAdminRole(projectsLength);
    }

    function calculateNumberOfVotesForAdminRole (projectsLength) {
      return Math.floor(projectsLength / 2);
    }

  }
})();


