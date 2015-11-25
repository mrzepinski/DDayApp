(function () {
  'use strict';

  angular
    .module('ddayApp')
    .factory('Mandrill', Mandrill);

  /** @ngInject */
  function Mandrill ($http) {

    return {
      send: send
    };

    function send (data) {
      return $http.post('/api/mandrill', data);
    }

  }
})();
