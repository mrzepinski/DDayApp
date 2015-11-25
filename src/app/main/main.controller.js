(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController ($timeout, Auth, Settings, Project, Voting, $q, toastr) {

    var vm = this,
      users,
      allVotesCount = 0,
      rawVotes,
      projectsIds;

    vm.inProgress = true;

    vm.stats = {
      projects: 0,
      members: 0,
      todos: 0
    };

    vm.voting = {
      fakeLabels: [],
      realLabels: [],
      data: [[]],
      colours: ['#3f51b5'],
      remaining: 0,
      progress: 0,
      inProgress: true,
      timerFinished: false,
      stopTimer: function () {
        $timeout(function () {
          vm.voting.timerFinished = true;
        });
      }
    };

    vm.firstPartOfEmail = firstPartOfEmail;

    $q.all({
      settings: Settings.all().$loaded(),
      projects: Project.all().$loaded()
    }).then(function (results) {
      vm.settings = results.settings;
      vm.projects = results.projects;
      setUpProjects();
      vm.projects.$watch(function (e) {
        if ('child_changed' === e.event) {
          setUpProjects();
        }
      });

      if (vm.settings.votingEnabled) {
        $q.all({
          users: Auth.getUsers().$loaded(),
          votes: Voting.all().$loaded()
        }).then(function (results) {
          users = results.users;
          calculateVotesSize();

          rawVotes = results.votes;
          calculateVotes();
          rawVotes.$watch(function (e) {
            if ('value' === e.event) {
              calculateVotes();
            }
          });
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

    function setUpProjects () {
      $timeout(function () {
        var members = 0;
        var todos = 0;
        vm.voting.fakeLabels = _.fill(Array(_.size(vm.projects)), '?');
        projectsIds = _.pluck(vm.projects, '$id');
        vm.voting.realLabels = _.map(_.pluck(vm.projects, 'title'), function (title) {
          return _.trunc(title, 15);
        });
        _.each(vm.projects, function (project) {
          members += _.size(project.team);
          todos += _.size(project.todos);

          project.progress = 0;
          if (_.size(project.todos) > 0) {
            project.progress = Math.round(_.size(_.filter(project.todos, { done: true })) / _.size(project.todos) * 100);
          }
        });
        vm.stats.projects = _.size(vm.projects);
        vm.stats.projectsS = (1 < vm.stats.projects) ? 's' : '';
        vm.stats.members = members;
        vm.stats.membersS = (1 < vm.stats.members) ? 's' : '';
        vm.stats.todos = todos;
        vm.stats.todosS = (1 < vm.stats.todos) ? 's' : '';
        if (vm.settings.votingEnabled) {
          calculateVotes();
        }
        vm.projects = _.shuffle(vm.projects);
      });
    }

    function calculateVotesSize () {
      _.each(users, function (user) {
        if (Voting.hasVotingRights(user)) {
          allVotesCount += Voting.getAvailableVotesForRole(user.role);
        }
      });
    }

    function calculateVotes () {
      $timeout(function () {
        var votesArray = _.flatten(_.values(rawVotes)),
          votes = _.countBy(votesArray, function (projectId) {
            return projectId;
          });
        vm.voting.data[0].splice(0, vm.voting.data[0].length);
        _.each(projectsIds, function (projectId) {
          if (votes[projectId]) {
            vm.voting.data[0].push(votes[projectId]);
          } else {
            vm.voting.data[0].push(0);
          }
        });
        vm.voting.remaining = (allVotesCount - _.reduce(vm.voting.data[0], function (total, n) {
          return total + n;
        }));
        vm.voting.progress = (allVotesCount - vm.voting.remaining) / allVotesCount * 100;
        vm.voting.inProgress = !!vm.voting.remaining;
      });
    }

    function firstPartOfEmail (email) {
      return email.substr(0, email.indexOf('@')) || '';
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
