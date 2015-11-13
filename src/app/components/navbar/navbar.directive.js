(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'navbar'
    };

    /** @ngInject */
    function NavbarController (Auth) {
      var vm = this,
        isAuthenticated = Auth.isAuthenticated(),
        links = [
          {
            route: 'project',
            label: 'Project',
            shouldShow: function () {
              return isAuthenticated;
            }
          },
          {
            route: 'voting',
            label: 'Voting',
            shouldShow: function () {
              return isAuthenticated;
            }
          },
          {
            route: 'account',
            label: 'Account',
            shouldShow: function () {
              return isAuthenticated;
            }
          },
          //{
          //  route: 'settings',
          //  label: 'Settings',
          //  shouldShow: function () {
          //    return isAuthenticated;
          //  }
          //},
          {
            route: 'auth',
            label: 'Login',
            shouldShow: function () {
              return !isAuthenticated;
            }
          },
          {
            route: null,
            label: 'Logout',
            shouldShow: function () {
              return isAuthenticated;
            },
            onClick: Auth.logout
          }
        ],
        filterLinks = function () {
          _.each(links, function (link) {
            if (link.shouldShow()) {
              vm.links.push(link);
            }
          });
        };

      vm.links = [
        {
          route: 'dashboard',
          label: 'Dashboard'
        }
      ];
      filterLinks();
    }
  }

})();
