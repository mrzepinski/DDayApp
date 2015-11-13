(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController ($scope, Project, Settings, toastr) {

    var vm = this;

    vm.inProgress = true;

    vm.settings = Settings.all();

    Project.all().$loaded(function (projects) {
      /* eslint-disable */
      $scope.projects = projects;
      /* eslint-enable */
      setUp();
      vm.inProgress = false;
    }, handleError);

    function setUp () {
      var todos = 0;
      var people = 0;
      _.each($scope.projects, function (project) {
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
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
