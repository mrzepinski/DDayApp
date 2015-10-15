(function () {
  'use strict';

  angular
    .module('ddayApp')
    .config(routerConfig)
    .run(routeListener);

  /** @ngInject */
  function routeListener ($rootScope, $state, Auth) {
    /* eslint-disable */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.toState = toState;
      $rootScope.toParams = toParams;
      $rootScope.fromState = fromState;
      $rootScope.fromParams = fromParams;
      if (toState.authenticate && !Auth.isAuthenticated()) {
        $state.transitionTo('auth');
        event.preventDefault();
      } else if (!toState.authenticate && Auth.isAuthenticated()) {
        $state.transitionTo('home');
        event.preventDefault();
      }
    });
    /* eslint-enable */
  }

  /** @ngInject */
  function routerConfig ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/auth');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        authenticate: true
      })
      .state('auth', {
        url: '/auth',
        templateUrl: 'app/auth/auth.html',
        controller: 'AuthController',
        controllerAs: 'auth',
        authenticate: false
      })
      .state('account', {
        url: '/account',
        templateUrl: 'app/account/account.html',
        controller: 'AccountController',
        controllerAs: 'account',
        authenticate: true
      });
  }

})();
