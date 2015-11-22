(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Voting', Voting);

  /** @ngInject */
  function Voting (FirebaseRef, $firebaseObject) {

    var votes = $firebaseObject(FirebaseRef.votes),
      votesPerRole = {
        USER: 2,
        ADMIN: 2,
        VIP: 4
      };

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

    function getAvailableVotesForRole (role) {
      if (!role) {
        return votesPerRole.USER;
      }
      return votesPerRole[role];
    }

  }
})();


