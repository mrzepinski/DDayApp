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
      var vm = this;

      vm.isAuthenticated = Auth.isAuthenticated();
      vm.logout = Auth.logout;
    }
  }

})();
