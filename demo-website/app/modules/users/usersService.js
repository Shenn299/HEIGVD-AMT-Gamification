(function() {
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
		.factory('UsersService', Users);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Users.$inject = ['$http'];

		function Users ($http) {

		}

})();
