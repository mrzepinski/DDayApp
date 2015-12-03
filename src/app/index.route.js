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

      if ($state.current.abstract) {
        return;
      }

      var isAuthenticated = Auth.isAuthenticated();
      if (toState.authenticate && !isAuthenticated) {
        $state.transitionTo('auth');
        event.preventDefault();
      } else if (!toState.authenticate && isAuthenticated) {
        if (_.contains([$state.current.name, toState.name], 'dashboard')) {
          return;
        }
        $state.transitionTo('dashboard');
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
      .state('dashboard', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('readme', {
        url: '/readme',
        templateUrl: 'app/readme/readme.html',
        controller: 'ReadmeController',
        controllerAs: 'readme'
      })
      .state('auth', {
        url: '/auth',
        templateUrl: 'app/auth/auth.html',
        controller: 'AuthController',
        controllerAs: 'auth'
      })
      .state('account', {
        url: '/account',
        templateUrl: 'app/account/account.html',
        controller: 'AccountController',
        controllerAs: 'account',
        authenticate: true
      })
      .state('project', {
        url: '/project',
        templateUrl: 'app/project/project.html',
        controller: 'ProjectController',
        controllerAs: 'project',
        authenticate: true
      })
      .state('voting', {
        url: '/voting',
        templateUrl: 'app/voting/voting.html',
        controller: 'VotingController',
        controllerAs: 'voting',
        authenticate: true
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'settings',
        authenticate: true
      });
  }

})();
