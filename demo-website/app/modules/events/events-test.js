(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:eventsTest
	 * @description
	 * # eventsTest
	 * Test of the app
	 */

	describe('events test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('gamificationapiwebsitedemo');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('EventsCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
