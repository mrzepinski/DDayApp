(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController ($scope, Project, toastr) {

    var vm = this;

    vm.inProgress = true;

    Project.all().$loaded(function (projects) {
      var todos = 0;
      var people = 0;
      _.each(projects, function (project) {
        todos += _.size(project.todos);
        people += _.size(project.team);

        if (_.size(project.todos) > 0) {
          project.progress = Math.round(_.size(_.filter(project.todos, { done: true })) / _.size(project.todos) * 100);
        } else {
          project.progress = 100;
        }
      });
      vm.todos = todos;
      vm.people = people;
      $scope.projects = projects;
      vm.inProgress = false;
    }, handleError);

    function handleError (error) {
      toastr.clear();
      toastr.error(error);
    }

  }
})();
