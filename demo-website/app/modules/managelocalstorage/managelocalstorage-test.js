(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:managelocalstorageTest
	 * @description
	 * # managelocalstorageTest
	 * Test of the app
	 */

	describe('managelocalstorage test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('gamificationapiwebsitedemo');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('ManagelocalstorageCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
