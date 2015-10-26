(function () {
  'use strict';

  /* eslint-disable */
  if ('applicationCache' in window) {
    window.applicationCache.addEventListener('updateready', function onUpdateReady () {
      window.location.reload();
    });
  }
  /* eslint-enable */

  angular
    .module('ddayApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock ($log) {
    $log.info('DDayApp initalized!');
  }

})();
