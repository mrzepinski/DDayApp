(function () {
  'use strict';

  angular
    .module('ddayApp')
    .directive('footer', footer);

  function footer () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/footer/footer.html'
    };
  }

})();
