(function () {
  'use strict';

  angular
    .module('ddayApp')
    .controller('ProjectController', ProjectController);

  /** @ngInject */
  function ProjectController (Auth, Project, toastr) {
    var vm = this;

    vm.inProgress = true;

    vm.raw = {
      uid: null,
      title: '',
      description: '',
      todos: [],
      team: []
    };

    vm.addOrUpdateMode = true;
    vm.model = null;

    Auth.getLoggedIn().then(function (loggedIn) {
      vm.loggedIn = loggedIn;
      Auth.getLoggedInProfile(vm.loggedIn.uid).then(function (user) {
        vm.user = user;
        vm.raw.team.push({
          email: vm.loggedIn.password.email
        });
        if (vm.user.projectId) {
          Project.findById(vm.user.projectId).$loaded(function (project) {
            vm.model = project;
            vm.addOrUpdateMode = false;
          }, handleError).finally(function () {
            vm.inProgress = false;
          });
        } else {
          vm.model = angular.extend({}, vm.raw);
          vm.model.uid = vm.loggedIn.uid;
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
    vm.editTodoStart = editTodoStart;
    vm.editTodoStop = editTodoStop;
    vm.editTodoDone = editTodoDone;
    vm.editTodoCheckIfStop = editTodoCheckIfStop;
    vm.toggleTodo = toggleTodo;
    vm.reorderTodos = reorderTodos;

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

      if (!vm.model.todos) {
        vm.model.todos = [];
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

    function editTodoStart (todo) {
      todo.editMode = true;
    }

    function editTodoStop (todo) {
      todo.editMode = false;
    }

    function editTodoDone ($index, todo) {
      if (!todo.name.trim()) {
        removeTodo($index);
      } else {
        delete todo.editMode;
        if (angular.isFunction(vm.model.$save)) {
          vm.model.$save().then(null, handleError);
        }
      }
    }

    function editTodoCheckIfStop ($event, todo) {
      if (27 === $event.keyCode) {
        editTodoStop(todo);
      }
    }

    function toggleTodo () {
      if (angular.isFunction(vm.model.$save)) {
        vm.model.$save().then(null, handleError);
      }
    }

    function reorderTodos ($index) {
      removeTodo($index);
    }

    function createPerson () {
      var email = vm.person.email.trim();
      if (!email) {
        return;
      }

      if (!vm.model.team) {
        vm.model.team = [];
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
      toastr.error(error.toString());
    }

  }
})();
