(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController ($timeout, Project, Settings, Voting, toastr) {

    var vm = this,
      rawVotes,
      projectsIds;

    vm.inProgress = true;
    vm.stats = {
      projects: 0,
      members: 0,
      todos: 0
    };

    vm.settings = Settings.all();

    vm.projects = Project.all();
    vm.projects.$loaded(function () {
      setUpProjects();
      vm.projects.$watch(function (e) {
        if ('child_changed' === e.event) {
          setUpProjects();
        }
      });
      vm.inProgress = false;
    }, handleError);

    rawVotes = Voting.all();
    rawVotes.$loaded(function () {
      calculateVotes();
      rawVotes.$watch(function (e) {
        if ('value' === e.event) {
          calculateVotes();
        }
      });
    }, handleError);

    vm.votes = {
      fakeLabels: [],
      realLabels: [],
      data: [[]],
      colours: ['#3f51b5']
    };

    function setUpProjects () {
      $timeout(function () {
        var members = 0;
        var todos = 0;
        vm.votes.fakeLabels = _.fill(Array(_.size(vm.projects)), '?');
        projectsIds = _.pluck(vm.projects, '$id');
        vm.votes.realLabels = _.pluck(vm.projects, 'title');
        _.each(vm.projects, function (project) {
          members += _.size(project.team);
          todos += _.size(project.todos);

          if (_.size(project.todos) > 0) {
            project.progress = Math.round(_.size(_.filter(project.todos, { done: true })) / _.size(project.todos) * 100);
          } else {
            project.progress = 100;
          }
        });
        vm.stats.projects = _.size(vm.projects);
        vm.stats.members = members;
        vm.stats.todos = todos;
        if (vm.settings.votingEnabled) {
          calculateVotes();
        }
      });
    }

    function calculateVotes () {
      $timeout(function () {
        var votes = _.countBy(_.values(rawVotes), function (projectId) {
          return projectId;
        });
        vm.votes.data[0].splice(0, vm.votes.data[0].length);
        _.each(projectsIds, function (projectId) {
          if (votes[projectId]) {
            vm.votes.data[0].push(votes[projectId]);
          } else {
            vm.votes.data[0].push(0);
          }
        })
      });
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
