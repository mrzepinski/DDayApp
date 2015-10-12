(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('mdlUpgrade', mdlUpgrade);

  /** @ngInject */
  function mdlUpgrade ($window, $timeout) {
    return {
      restrict: 'A',
      compile: function compileFn () {
        return {
          post: function postLink ($scope, $element) {
            $timeout(function () {
              $window.componentHandler.upgradeElements($element[0]);
            }, 0);
          }
        };
      }
    };
  }
})();
