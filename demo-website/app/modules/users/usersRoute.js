'use strict';

/**
 * @ngdoc function
 * @name app.route:usersRoute
 * @description
 * # usersRoute
 * Route of the app
 */

angular.module('users')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.users', {
				url:'/users',
				templateUrl: 'app/modules/users/users.html',
				controller: 'UsersCtrl',
				controllerAs: 'vm'
			});

		
	}]);
