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

	UsersService.$inject = ['$http'];

	function UsersService($http) {

		var service = {

			// Authenticate the application
			getUsers: function (authenticationToken, apiUrl) {
				return $http({
					method: 'GET',
					url: apiUrl + '/users',
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
