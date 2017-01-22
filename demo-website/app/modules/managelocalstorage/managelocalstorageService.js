(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:managelocalstorageService
	 * @description
	 * # managelocalstorageService
	 * Service of the app
	 */

	angular
		.module('managelocalstorage')
		.factory('ManagelocalstorageService', ManagelocalstorageService);

	ManagelocalstorageService.$inject = ['$http', '$window'];

	function ManagelocalstorageService($http, $window) {

		var service = {

			// Save the authentication token in the browser local storage
			saveTokenOnBrowserLocalStorage: function (authenticationToken) {
				$window.localStorage.setItem('authenticationToken', authenticationToken);
			},


			// Get the authentication token from the browser local storage
			getTokenFromBrowserLocalStorage: function () {
				return $window.localStorage.getItem('authenticationToken');
			}

		}

		return service;

	}

})();