import 'jquery';
import 'fontAwesome';
import 'bootstrapCss';
import './main.scss';

define([
	'common-ui/core',
	'common-ui/coreLogger',
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
