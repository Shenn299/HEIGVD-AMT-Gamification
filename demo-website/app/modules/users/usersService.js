(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:usersService
	 * @description
	 * # usersService
	 * Service of the app
	 */

	angular
		.module('users')
		.factory('UsersService', UsersService);

	UsersService.$inject = ['$http', '__env'];

	function UsersService($http, __env) {

		var service = {

			// Authenticate the application
			getUsers: function (authenticationToken) {
				return $http({
					method: 'GET',
					url: __env.API_URL + '/users',
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Bearer ' + authenticationToken
					}
				});

			}

		};

		return service;

	}

})();
