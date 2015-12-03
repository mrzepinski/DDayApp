(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('ReadmeController', ReadmeController);

  /** @ngInject */
  function ReadmeController (Settings, toastr) {

    var vm = this;

    vm.inProgress = true;

    Settings.all().$loaded(function (data) {
      vm.settings = data;
    }, handleError).finally(function () {
      vm.inProgress = false;
    });

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
