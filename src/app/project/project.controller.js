(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('ProjectController', ProjectController);

  /** @ngInject */
  function ProjectController (Auth, FirebaseRef, $firebaseObject, Project, toastr) {
    var vm = this;

    vm.inProgress = true;

    vm.raw = {
      title: '',
      description: '',
      todos: [],
      team: []
    };

    vm.addOrUpdateMode = true;
    vm.model = null;

    Auth.getLoggedIn().then(function (loggedIn) {
      vm.loggedIn = loggedIn;
      $firebaseObject(FirebaseRef.userById(vm.loggedIn.uid)).$loaded(function (user) {
        vm.user = user;
        if (vm.user.projectId) {
          Project.findById(vm.user.projectId).$loaded(function (project) {
            vm.model = project;
            vm.addOrUpdateMode = false;
          }, handleError).finally(function () {
            vm.inProgress = false;
          });
        } else {
          vm.raw.team.push({
            email: vm.loggedIn.password.email
          });
          vm.model = angular.extend({}, vm.raw);
          vm.inProgress = false;
        }
      }, handleError).finally(function () {
        vm.inProgress = false;
      });
    });

    vm.addOrUpdateInProgress = false;
    vm.updateMode = updateMode;
    vm.addOrUpdateProject = addOrUpdateProject;
    vm.removeProject = removeProject;

    vm.todo = {
      name: ''
    };

    vm.createTodo = createTodo;
    vm.removeTodo = removeTodo;
    vm.toggleTodo = toggleTodo;

    vm.person = {
      email: ''
    };

    vm.createPerson = createPerson;
    vm.removePerson = removePerson;

    function updateMode () {
      vm.addOrUpdateMode = true;
    }

    function addOrUpdateProject () {
      var title = vm.model.title.trim();
      if (!title) {
        toastr.warning('You need to type a title!');
        return;
      }

      var description = vm.model.description.trim();
      if (!description) {
        toastr.warning('Your need to type a description!');
        return;
      }

      vm.addOrUpdateInProgress = true;

      if (angular.isFunction(vm.model.$save)) {
        vm.model.$save().then(function () {
          vm.addOrUpdateMode = false;
          toastr.success('Your project was successfully updated!');
        }, handleError).finally(function () {
          vm.addOrUpdateInProgress = false;
        });
        return;
      }

      Project.create(vm.model).then(function (id) {
        vm.user.projectId = id;
        vm.user.$save().then(null, handleError);
        Project.findById(vm.user.projectId).$loaded(function (data) {
          vm.model = data;
          vm.addOrUpdateMode = false;
        }, handleError).finally(function () {
          vm.addOrUpdateInProgress = false;
          toastr.success('Your project was successfully created!');
        });
      }, handleError).finally(function () {
        vm.addOrUpdateInProgress = false;
      });
    }

    function removeProject () {
      vm.inProgress = true;
      vm.model.$remove().then(function () {
        vm.addOrUpdateMode = true;
        vm.model = angular.extend({}, vm.raw);
        vm.user.projectId = null;
        vm.user.$save().then(null, handleError);
        toastr.success('Your project has been removed!');
      }, handleError).finally(function () {
        vm.inProgress = false;
      });
    }

    function createTodo () {
      var name = vm.todo.name.trim();
      if (!name) {
        return;
      }

      vm.model.todos.push({
        name: name,
        done: false
      });
      if (angular.isFunction(vm.model.$save)) {
        vm.model.$save().then(null, handleError);
      }
      vm.todo.name = '';
    }

    function removeTodo ($index) {
      vm.model.todos.splice($index, 1);
      if (angular.isFunction(vm.model.$save)) {
        vm.model.$save().then(null, handleError);
      }
    }

    function toggleTodo () {
      if (angular.isFunction(vm.model.$save)) {
        vm.model.$save().then(null, handleError);
      }
    }

    function createPerson () {
      var email = vm.person.email.trim();
      if (!email) {
        return;
      }

      vm.model.team.push({
        email: email
      });
      if (angular.isFunction(vm.model.$save)) {
        vm.model.$save().then(null, handleError);
      }
      vm.person.email = '';
    }

    function removePerson ($index) {
      vm.model.team.splice($index, 1);
      if (angular.isFunction(vm.model.$save)) {
        vm.model.$save().then(null, handleError);
      }
    }

    function handleError (error) {
      toastr.clear();
      toastr.error(error);
    }

  }
})();