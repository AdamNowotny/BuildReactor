import 'angular-animate';
import 'angular-route';
import 'angular-ui-utils/modules/highlight/highlight';
import 'angular-ui-utils/modules/indeterminate/indeterminate';
import 'common/directives/module';
import 'angular-legacy-sortablejs-maintained';
import accordion from 'angular-ui-bootstrap/src/accordion';
import angular from 'angular';
import dropdown from 'angular-ui-bootstrap/src/dropdown/index-nocss';
import modal from 'angular-ui-bootstrap/src/modal/index-nocss';
import tooltip from 'angular-ui-bootstrap/src/tooltip/index-nocss.js';

export default angular.module('settings', [
	'ngAnimate',
	'ngRoute',
	accordion,
	dropdown,
	modal,
	tooltip,
	'ui.highlight',
	'ui.indeterminate',
	'ng-sortable',
	'app.directives'
]);
