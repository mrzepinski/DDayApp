(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('mdlUpgrade', mdlUpgrade)
    .directive('mdlProgress', mdlProgress);

  /** @ngInject */
  function mdlUpgrade ($window, $timeout) {
    return {
      restrict: 'A',
      priority: 2,
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

  /** @ngInject */
  function mdlProgress ($timeout) {
    return {
      restrict: 'A',
      priority: 1,
      compile: function compileFn () {
        return {
          post: function postLink ($scope, $element, $attrs) {
            $timeout(function () {
              $element[0].addEventListener('mdl-componentupgraded', function() {
                this.MaterialProgress.setProgress($attrs.mdlProgress);
              });
            }, 0);
          }
        };
      }
    };
  }
})();
