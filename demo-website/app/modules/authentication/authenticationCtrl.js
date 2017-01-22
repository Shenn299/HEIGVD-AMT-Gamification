(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:authenticationCtrl
	* @description
	* # authenticationCtrl
	* Controller of the app
	*/

	angular
		.module('authentication')
		.controller('AuthenticationCtrl', Authentication);

	Authentication.$inject = ['$http', 'AuthenticationService', 'ManagelocalstorageService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Authentication($http, AuthenticationService, ManagelocalstorageService) {
		/*jshint validthis: true */
		var vm = this;

		// Gamification API URL
		vm.API_URL = "http://localhost:8090/api";

		vm.response = "";

		vm.application = {
			name: "",
			password: ""
		}

		// Authenticate the application
		vm.authenticate = function () {

			if (vm.application.name && vm.application.password) {

				AuthenticationService.authenticate(vm.application, vm.API_URL)
					.then(function successCallback(response) {
						if (response.status == 200) {
							vm.response = "Authentication successful ! \nYour authentication token is saved in your browser local storage";
							// Save the authentication token in the browser local storage
							var authenticationToken = response.data;
							ManagelocalstorageService.saveTokenOnBrowserLocalStorage(authenticationToken);
						}
					});
			}
			else {
				vm.response = "The application name & the application password can't be empty";
			}
		}
	}

})();
