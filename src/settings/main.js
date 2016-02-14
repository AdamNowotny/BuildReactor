import 'jquery';
import 'fontAwesome';
import 'bootstrapCss';
import './main.scss';
import angular from 'angular';

define([
	'common/core',
	'common/coreLogger',
	'settings/app',
	'settings/controller',
	'settings/routes',
	'settings/serviceSettingsCtrl',
	'settings/addServiceCtrl',
	'settings/viewSettings/controller',
	'settings/configuration/controller',
	'settings/directives/alert/alert',
	'settings/directives/dynamicForm/dynamicForm',
	'settings/directives/filterQuery/filterQuery',
	'settings/directives/focusIf/focusIf',
	'settings/directives/projectList/projectList',
	'settings/directives/selectedProjects/selectedProjects',
	'settings/directives/serviceNamePanel/serviceNamePanel',
	'settings/directives/sidebar/sidebar',
	'settings/directives/onOffSwitch/onOffSwitch',
	'settings/directives/thumbnails/thumbnails',
	'settings/directives/topnav/topnav',
	'settings/directives/viewSelection/viewSelection'
], function (core, logger) {

	'use strict';

	logger();
	core.init();
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['settings']);
	});

});
