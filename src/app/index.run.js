(function () {
  'use strict';

  angular
    .module('ddayApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock ($log) {
    $log.info('DDayApp initalized!');
  }

})();
