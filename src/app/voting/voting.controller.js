(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('VotingController', VotingController);

  /** @ngInject */
  function VotingController (Auth, FirebaseRef, $firebaseObject, Vote, Project, toastr) {
    var vm = this;

    vm.inProgress = true;
    vm.loaded = false;
    vm.model = null;

    Project.all().$loaded(function (projects) {
      vm.projects = projects;
      vm.inProgress = false;
    }, handleError);

    Auth.getLoggedIn().then(function (loggedIn) {
      vm.loggedIn = loggedIn;
      $firebaseObject(FirebaseRef.userById(vm.loggedIn.uid)).$loaded(function (user) {
        vm.user = user;
      }, handleError);
    });

    vm.votingInProgress = false;
    vm.vote = vote;

    function vote () {
      Vote.add(vm.model).then(function (id) {
        vm.user.voteId = id;
        vm.user.$save();
        vm.votingInProgress = false;
        toastr.success('We got your vote!');
      }, handleError);
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
