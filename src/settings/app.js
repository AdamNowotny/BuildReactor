import "bootstrap/js/modal";
import 'angular-route';
import 'angular-ui-bootstrap';
import 'angular-ui-utils/modules/highlight/highlight';
import 'angular-ui-utils/modules/indeterminate/indeterminate';
import angular from 'angular';

define([
	'html5sortable/src/html.sortable.angular'
], function() {

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
