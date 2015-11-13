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

    vm.form = {
      dateTime: {
        date: null,
        time: null
      }
    };

    Settings.all().$loaded(function (data) {
      vm.data = data;
    }, handleError).finally(function () {
      vm.inProgress = false;
    });

    vm.save = save;
    vm.setDateTime = setDateTime;

    function save () {
      vm.saving = true;
      vm.data.$save().then(function () {
        toastr.success('Settings was sucessfully saved.');
      }, handleError).finally(function () {
        vm.saving = false;
      });
    }

    function setDateTime () {
      if (!vm.form.dateTime.date || !vm.form.dateTime.time) {
        toastr.warning('Pick date and time!');
        return;
      }

      var dd = vm.form.dateTime.date.getDate(),
        mm = vm.form.dateTime.date.getMonth() + 1,
        yy = vm.form.dateTime.date.getFullYear(),
        hh = vm.form.dateTime.time.getHours(),
        ms = vm.form.dateTime.time.getMinutes(),
        dateTime = yy + ',' + mm + ',' + dd + ' ' + hh + ':' + ms;

      angular.extend(vm.data, {
        dateTimeCountdown: new Date(dateTime).getTime()
      });

      vm.form.dateTime.date = null;
      vm.form.dateTime.time = null;

      save();
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
