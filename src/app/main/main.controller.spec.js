(function () {
  'use strict';

  describe('controllers', function () {
    var main;

    beforeEach(module('ddayApp'));
    beforeEach(inject(function (_$controller_) {
      main = _$controller_('MainController');
    }));

  });
})();
