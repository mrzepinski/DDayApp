(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('VotingController', VotingController);

  /** @ngInject */
  function VotingController (Auth, Voting, Project, Settings, toastr) {
    var vm = this;

    vm.inProgress = true;
    vm.loaded = false;
    vm.model = null;

    vm.settings = Settings.all();
    vm.votes = Voting.all();

    Project.all().$loaded(function (projects) {
      vm.projects = projects;
      vm.inProgress = false;
    }, handleError);

    Auth.getLoggedIn().then(function (loggedIn) {
      vm.loggedIn = loggedIn;
      Auth.getLoggedInProfile(vm.loggedIn.uid).then(function (user) {
        vm.user = user;
      }, handleError);
    });

    vm.votingInProgress = false;
    vm.vote = vote;

    function vote (projectId) {
      vm.votingInProgress = true;
      vm.user.voteForProjectId = projectId;
      vm.user.$save().then(null, handleError);
      var vote = {};
      vote[vm.loggedIn.uid] = projectId;
      angular.extend(vm.votes, vote);
      vm.votes.$save().then(function () {
        toastr.success('We got your vote!');
      }, handleError).finally(function () {
        vm.votingInProgress = false;
      });
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
