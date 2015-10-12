(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar () {
    return {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'navbar'
    };

    /** @ngInject */
    function NavbarController () {
      var ctrl = this;
    }
  }

})();
