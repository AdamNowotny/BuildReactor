import "bootstrap/js/modal";
import 'angular-route';
import 'angular-ui-bootstrap';
import 'angular-ui-utils/modules/highlight/highlight';
import 'angular-ui-utils/modules/indeterminate/indeterminate';
import 'common/directives/module';
import angular from 'angular';

export default angular.module('settings', [
	'ngRoute',
	'ui.bootstrap',
	'ui.highlight',
	'ui.indeterminate',
	'htmlSortable',
	'app.directives'
]);
