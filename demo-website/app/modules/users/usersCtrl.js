(function() {
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

		Users.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Users() {
			/*jshint validthis: true */
			var vm = this;

		}

})();
