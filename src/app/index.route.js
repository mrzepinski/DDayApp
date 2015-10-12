(function () {
  'use strict';

  angular
    .module('ddayApp')
    .config(routerConfig)
    .run(routeListener);

  /** @ngInject */

  function routeListener ($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.toState = toState;
      $rootScope.toParams = toParams;
      $rootScope.fromState = fromState;
      $rootScope.fromParams = fromParams;
      if (toState.authenticate && !Auth.isAuthenticated()) {
        $state.transitionTo('login');
        event.preventDefault();
      }
    });
  }

  /** @ngInject */
  function routerConfig ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        authenticate: true
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login',
        authenticate: false
      })
      .state('create-account', {
        url: '/create-account',
        templateUrl: 'app/login/create-account.html',
        controller: 'ResetPasswordController',
        controllerAs: 'create',
        authenticate: false
      })
      .state('reset-password', {
        url: '/reset-password',
        templateUrl: 'app/login/reset-password.html',
        controller: 'ResetPasswordController',
        controllerAs: 'reset',
        authenticate: false
      });
  }

})();
