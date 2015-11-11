(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('inputFocus', inputFocus);

  /** @ngInject */
  function inputFocus ($timeout) {
    return {
      restrict: 'A',
      link: link
    };

    /** @ngInject */
    function link ($scope, $element) {
      $timeout(function () {
        $element[0].focus();
      }, 100);
    }
  }

})();
