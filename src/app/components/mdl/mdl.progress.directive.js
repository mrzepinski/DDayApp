(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('mdlProgress', mdlProgress);

  /** @ngInject */
  function mdlProgress ($timeout) {
    return {
      restrict: 'A',
      priority: 500,
      scope: {
        mdlProgress: '=mdlProgress'
      },
      compile: function compileFn () {
        return {
          post: function postLink ($scope, $element) {
            var setProgress = function () {
                $timeout(function () {
                  $element[0].MaterialProgress.setProgress($scope.mdlProgress);
                });
              },
              unwatch;

            unwatch = $scope.$watch('mdlProgress', setProgress);

            $scope.$on('$destroy', function () {
              unwatch();
            });
          }
        };
      }
    };
  }
})();
