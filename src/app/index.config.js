(function () {
  'use strict';

  angular
    .module('ddayApp')
    .config(config)
    .constant('FIREBASE_URL', 'https://ddayappwkpl.firebaseio.com');

  /** @ngInject */
  function config ($logProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 5000;
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.progressBar = true;
  }

})();
