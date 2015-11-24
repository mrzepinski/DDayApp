(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('VotingController', VotingController);

  /** @ngInject */
  function VotingController (Auth, Voting, Project, Settings, $q, toastr) {
    var vm = this,
      loggedIn = null,
      userFirebaseObj = null,
      allVotesFirebaseArray = null,
      userVotes = [],
      availableVotesForUserRole;

    vm.inProgress = true;
    vm.loaded = false;
    vm.model = null;

    Auth.getLoggedIn().then(function (loggedInResp) {
      loggedIn = loggedInResp;
      Auth.getLoggedInProfile(loggedIn.uid).then(function (userResp) {
        userFirebaseObj = userResp;
        if (!Voting.hasVotingRights(userFirebaseObj)) {
          vm.noRights = false;
          vm.inProgress = false;
          return;
        }

        availableVotesForUserRole = Voting.getAvailableVotesForRole(userFirebaseObj.role);

        vm.settings = Settings.all();
        vm.settings.$loaded(function () {
          if (vm.settings.votingEnabled) {
            $q.all({
              projects: Project.all().$loaded(),
              votes: Voting.all().$loaded()
            }).then(function (results) {
              vm.projects = _.shuffle(results.projects);
              allVotesFirebaseArray = results.votes;
              if (allVotesFirebaseArray[loggedIn.uid]) {
                userVotes = allVotesFirebaseArray[loggedIn.uid];
              }
              vm.remainingVotes = availableVotesForUserRole - _.size(userVotes);
              vm.progress = (availableVotesForUserRole - vm.remainingVotes) / availableVotesForUserRole * 100;
            }, handleError).finally(function () {
              vm.inProgress = false;
            });
          } else {
            vm.inProgress = false;
          }
        }, function (error) {
          vm.inProgress = false;
          handleError(error);
        });
      }, function (error) {
        vm.inProgress = false;
        handleError(error);
      });
    });

    vm.votingInProgress = false;
    vm.hasVote = hasVote;
    vm.voteCount = voteCount;
    vm.vote = vote;
    vm.unvote = unvote;
    vm.truncate = _.trunc;

    function hasVote (projectId) {
      return _.contains(userVotes, projectId);
    }

    function voteCount (projectId) {
      return _.size(_.where(userVotes, projectId));
    }

    function vote (projectId) {
      if (vm.votingInProgress) {
        toastr.warning('Wait!');
        return;
      }

      if (0 === vm.remainingVotes) {
        toastr.warning('You do not have more votes!');
        return;
      }

      vm.votingInProgress = true;
      userVotes.push(projectId);
      var votes = {};
      votes[loggedIn.uid] = userVotes;
      angular.extend(allVotesFirebaseArray, votes);
      allVotesFirebaseArray.$save()
        .then(null, handleError)
        .finally(function () {
          vm.votingInProgress = false;
          vm.remainingVotes = availableVotesForUserRole - _.size(userVotes);
          vm.progress = (availableVotesForUserRole - vm.remainingVotes) / availableVotesForUserRole * 100;
        });
    }

    function unvote ($event, projectId) {
      $event.stopPropagation();
      if (vm.votingInProgress) {
        toastr.warning('Wait!');
        return;
      }

      vm.votingInProgress = true;
      userVotes.splice(_.indexOf(userVotes, projectId), 1);
      var votes = {};
      votes[loggedIn.uid] = userVotes;
      angular.extend(allVotesFirebaseArray, votes);
      allVotesFirebaseArray.$save()
        .then(null, handleError)
        .finally(function () {
          vm.votingInProgress = false;
          vm.remainingVotes = availableVotesForUserRole - _.size(userVotes);
          vm.progress = (availableVotesForUserRole - vm.remainingVotes) / availableVotesForUserRole * 100;
        });
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
