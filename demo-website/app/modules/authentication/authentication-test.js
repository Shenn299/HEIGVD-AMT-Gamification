(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:authenticationTest
	 * @description
	 * # authenticationTest
	 * Test of the app
	 */

	describe('authentication test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('gamificationapiwebsitedemo');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('AuthenticationCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
