(function () {
	'use strict';

	/**
	 * @ngdoc index
	 * @name app
	 * @description
	 * # app
	 *
	 * Main modules of the application.
	 */

	var env = {};

	// Import variables if present (from env.local.js)
	if (window) {
		Object.assign(env, window.__env);
	}

	angular.module('gamificationapiwebsitedemo', [
		'ngResource',
		'ngAria',
		'ui.bootstrap',
		'ngMaterial',
		'ngMdIcons',
		'ngCookies',
		'ngAnimate',
		'ngTouch',
		'ngSanitize',
		'ui.router',
		'home',
		'authentication',
		'events',
		'users',
		'managelocalstorage',
	])

		// Register environment in AngularJS as constant
		.constant('__env', env);

})();
