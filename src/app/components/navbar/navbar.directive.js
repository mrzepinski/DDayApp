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
    function NavbarController (Auth, toastr) {
      var vm = this,
        isAuthenticated = Auth.isAuthenticated(),
        userProfile = null,
        links = [
          {
            route: 'project',
            label: 'Project',
            shouldShow: function () {
              return isAuthenticated && userProfile && ('VIP' !== userProfile.role);
            }
          },
          {
            route: 'voting',
            label: 'Voting',
            shouldShow: function () {
              return isAuthenticated && userProfile && (userProfile.projectId || 'VIP' === userProfile.role);
            }
          },
          {
            route: 'account',
            label: 'Account',
            shouldShow: function () {
              return isAuthenticated;
            }
          },
          {
            route: 'settings',
            label: 'Settings',
            shouldShow: function () {
              return isAuthenticated && userProfile && ('ADMIN' === userProfile.role);
            }
          },
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
        ];

      vm.links = [
        {
          route: 'dashboard',
          label: 'Dashboard'
        }
      ];

      if (isAuthenticated) {
        Auth.getLoggedIn().then(function (loggedIn) {
          Auth.getLoggedInProfile(loggedIn.uid).$loaded(function (user) {
            userProfile = user;
            filterLinks();
          }, handleError);
        });
      } else {
        filterLinks();
      }

      function filterLinks () {
        _.each(links, function (link) {
          if (link.shouldShow()) {
            vm.links.push(link);
          }
        });
      }

      function handleError (error) {
        toastr.clear();
        toastr.error(error.toString());
      }
    }
  }

})();
