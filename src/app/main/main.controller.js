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
      $scope.projects = projects;
      vm.inProgress = false;
    }, handleError);

    function handleError (error) {
      toastr.clear();
      toastr.error(error);
    }

  }
})();
