(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('SettingsController', SettingsController);

  /** @ngInject */
  function SettingsController (Settings, Auth, Mandrill, toastr) {

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

    Auth.getUsers().$loaded(function (users) {
      vm.users = users;
    }, handleError);

    vm.vipUser = {
      email: '',
      pass: ''
    };

    vm.save = save;
    vm.setDateTime = setDateTime;
    vm.createVipUser = createVipUser;
    vm.hasAdminRole = hasAdminRole;
    vm.hasVipRole = hasVipRole;

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

    function createVipUser () {
      Auth.createAccount(vm.vipUser.email, vm.vipUser.pass, false, { role: 'VIP' }).then(function (user) {
        toastr.success('VIP account has been created!');
        Mandrill.send({
          toEmail: vm.vipUser.email,
          toName: user.name,
          subject: 'DDay VIP account has been created!',
          message: 'Your password: ' + vm.vipUser.pass
        });
      }, handleError).finally(function () {
        vm.vipUser.email = '';
        vm.vipUser.pass = '';
      });
    }

    function hasAdminRole (user) {
      return 'ADMIN' === user.role;
    }

    function hasVipRole (user) {
      return 'VIP' === user.role;
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error.toString());
    }

  }
})();
