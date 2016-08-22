(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('navbar', navbar)
    .directive('drawer', drawer);

  /** @ngInject */
  function navbar () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'app/components/header/navbar.html',
      controller: HeaderController,
      controllerAs: 'header'
    };
  }

  /** @ngInject */
  function drawer () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/header/drawer.html',
      controller: HeaderController,
      controllerAs: 'header'
    };
  }

  /** @ngInject */
  function HeaderController (Auth, toastr) {
    var vm = this,
      isAuthenticated = Auth.isAuthenticated(),
      userProfile = null,
      links = [
        {
          route: 'dashboard',
          label: 'Dashboard',
          shouldShow: function () {
            return true;
          }
        },
        {
          route: 'project',
          label: 'Project',
          shouldShow: function () {
            return isAuthenticated && userProfile;
          }
        },
        {
          route: 'voting',
          label: 'Voting',
          shouldShow: function () {
            return isAuthenticated && userProfile && userProfile.projectId;
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
          route: 'readme',
          label: 'Readme',
          shouldShow: function () {
            return true;
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

    vm.links = [];

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

})();
