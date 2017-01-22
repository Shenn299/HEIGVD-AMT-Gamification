'use strict';

/**
 * @ngdoc function
 * @name app.route:eventsRoute
 * @description
 * # eventsRoute
 * Route of the app
 */

angular.module('events')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.events', {
				url:'/events',
				templateUrl: 'app/modules/events/events.html',
				controller: 'EventsCtrl',
				controllerAs: 'vm'
			});

		
	}]);
