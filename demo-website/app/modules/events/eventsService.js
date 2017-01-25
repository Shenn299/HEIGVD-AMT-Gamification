(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:eventsService
	 * @description
	 * # eventsService
	 * Service of the app
	 */

	angular
		.module('events')
		.factory('EventsService', EventsService);

	EventsService.$inject = ['$http', '__env'];

	function EventsService($http, __env) {
		
		var service = {

			// Send event
			sendEvent: function (event, authenticationToken) {
				return $http({
					method: 'POST',
					url: __env.API_URL + '/events',
					data: { name: event.name, description: event.description, userAppId: event.userAppId },
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + authenticationToken
					}
				});

			}

		};

		return service;

	}

})();
