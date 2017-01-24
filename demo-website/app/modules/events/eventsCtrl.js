(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:eventsCtrl
	* @description
	* # eventsCtrl
	* Controller of the app
	*/

	angular
		.module('events')
		.controller('EventsCtrl', Events);

	Events.$inject = ['EventsService', 'ManagelocalstorageService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Events(EventsService, ManagelocalstorageService) {
		/*jshint validthis: true */
		var vm = this;

		vm.response = "";

		vm.event = {
			name: "",
			description: "",
			userAppId: ""
		}

		// Send event from gamified application to Gamification API
		vm.sendEvent = function () {

			if (vm.event.name && vm.event.description && vm.event.userAppId) {

				// Get the authentication token from the browser local storage
				var authenticationToken = ManagelocalstorageService.getTokenFromBrowserLocalStorage();

				// Send event
				EventsService.sendEvent(vm.event, authenticationToken)
					.then(function successCallback(response) {
						if (response.status == 201) {
							vm.response = "Event created successfully !";
						}
					})
			}
		};
	}

})();
