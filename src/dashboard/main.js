import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import './main.scss';

define([
	'common/core',
	'common/coreLogger',
	'angular',
	'dashboard/app',
	'dashboard/controller'
], function (core, logger, angular) {

	'use strict';

	core.init();
	logger();
	
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['dashboard']);
	});
});
