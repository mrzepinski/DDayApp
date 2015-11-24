(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('setHeight', setHeight);

  /** @ngInject */
  function setHeight () {
    return {
      restrict: 'A',
      priority: 100,
      compile: function compileFn () {
        return {
          post: function postLink ($scope, $element, $attrs) {
            var minHeight = parseInt($attrs['setHeightMin'], 10) || 0;
            $scope.$evalAsync(function () {
              var innerHeight = $element[0].scrollHeight,
                height;
              if (minHeight) {
                height = Math.max(minHeight, innerHeight);
              } else {
                height = innerHeight;
              }
              $element[0].setAttribute('style', ['height: ', height, 'px'].join(''));
            });
          }
        };
      }
    };
  }
})();
