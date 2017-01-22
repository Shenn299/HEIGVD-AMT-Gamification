'use strict';

/**
 * @ngdoc function
 * @name app.route:authenticationRoute
 * @description
 * # authenticationRoute
 * Route of the app
 */

angular.module('authentication')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.authentication', {
				url:'/authentication',
				templateUrl: 'app/modules/authentication/authentication.html',
				controller: 'AuthenticationCtrl',
				controllerAs: 'vm'
			});

		
	}]);
