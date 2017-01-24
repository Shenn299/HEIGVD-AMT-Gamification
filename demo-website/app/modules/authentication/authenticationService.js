(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:authenticationService
	 * @description
	 * # authenticationService
	 * Service of the app
	 */

	angular
		.module('authentication')
		.factory('AuthenticationService', AuthenticationService);

	AuthenticationService.$inject = ['$http', '__env'];

	function AuthenticationService($http, __env) {

		var service = {

			// Authenticate the application
			authenticate: function (application, apiUrl) {
				return $http({
					method: 'POST',
					url: __env.API_URL + '/authentications',
					data: { name: application.name, password: application.password },
					headers: {
						'Content-Type': 'application/json',
						Accept: 'text/plain'
					}
				});

			}

		};

		return service;

	}

})();
