(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('navbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar () {
    return {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function NavbarController () {
      var vm = this;
    }
  }

})();
