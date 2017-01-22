(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:usersTest
	 * @description
	 * # usersTest
	 * Test of the app
	 */

	describe('users test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('gamificationapiwebsitedemo');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('UsersCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
