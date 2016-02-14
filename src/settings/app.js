import "bootstrap/js/modal";
import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'angular-ui-utils/modules/highlight/highlight';
import 'angular-ui-utils/modules/indeterminate/indeterminate';

define([
	'html5sortable/src/html.sortable.angular'
], function () {

	'use strict';

	return angular.module('settings', [
		'ngRoute',
		'ui.bootstrap',
		'ui.highlight',
		'ui.indeterminate',
		'htmlSortable',
		'app.directives'
	]);
});
