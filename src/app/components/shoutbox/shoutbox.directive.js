(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('shoutbox', shoutbox);

  /** @ngInject */
  function shoutbox (malarkey) {
    return {
      restrict: 'E',
      scope: {
        values: '='
      },
      template: '&nbsp;',
      link: linkFn
    };

    function linkFn ($scope, $element) {
      var $$element = $element[0],
        typist = malarkey($$element, {
          typeSpeed: 100,
          deleteSpeed: 50,
          pauseDelay: 3000,
          loop: true,
          postfix: ' '
        });

      $$element.classList.add('shoutbox');

      angular.forEach($scope.values, function (value) {
        typist.type(value).pause().delete();
      });
    }

  }

})();
