(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('SettingsController', SettingsController);

  /** @ngInject */
  function SettingsController (Settings, toastr) {

    var vm = this;

    vm.inProgress = true;
    vm.data = null;

    Settings.all().$loaded(function (data) {
      vm.data = data;
      vm.inProgress = false;
    }, handleError);

    vm.save = save;

    function save () {
      vm.saving = true;
      vm.data.$save().then(function () {
        toastr.success('Settings was sucessfully saved.');
      }, handleError).finally(function () {
        vm.saving = false;
      });
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
