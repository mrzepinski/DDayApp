(function () {
  'use strict';

  describe('directive navbar', function () {
    var vm;
    var el;

    beforeEach(module('ddayApp'));
    beforeEach(inject(function ($compile, $rootScope) {
      el = angular.element('<navbar></navbar>');

      $compile(el)($rootScope.$new());
      $rootScope.$digest();
      vm = el.isolateScope().vm;
    }));

    it('should be compiled', function () {
      expect(el.html()).not.toEqual(null);
    });

  });
})();
