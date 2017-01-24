(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:usersCtrl
	* @description
	* # usersCtrl
	* Controller of the app
	*/

	angular
		.module('users')
		.controller('UsersCtrl', Users);

	Users.$inject = ['UsersService', 'ManagelocalstorageService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Users(UsersService, ManagelocalstorageService) {
		/*jshint validthis: true */
		var vm = this;

		// Gamification API URL
		vm.API_URL = "http://localhost:8090/api";

		// Get the authentication token from the browser local storage
		var authenticationToken = ManagelocalstorageService.getTokenFromBrowserLocalStorage();

		// Get users
		UsersService.getUsers(authenticationToken, vm.API_URL)
			.then(function successCallback(response) {
				if (response.status == 200) {
					vm.data = response.data;
				}
			})

	}

})();
