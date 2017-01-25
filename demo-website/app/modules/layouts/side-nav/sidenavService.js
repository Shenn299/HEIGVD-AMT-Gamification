(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:menuService
	 * @description
	 * # menuService
	 * Service of the app
	 */

  	angular
		.module('gamificationapiwebsitedemo')
		.factory('MenuService', Menu);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Menu.$inject = ['$http'];

		function Menu ($http) {

			var menu = [
				
					{
						link: 'authentication',
							name: 'Authentication'
					},
			    
					{
						link: 'events',
							name: 'Events'
					},
			    
					{
						link: 'users',
							name: 'Users'
					},
			
			    
		  	];

			return {
				listMenu: function () {
					return menu;
				}
		  	}

		}

})();
