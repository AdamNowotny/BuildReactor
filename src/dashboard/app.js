import 'angular-route';
import 'angular-ui-bootstrap';
import 'common/directives/buildList/buildList';
import angular from 'angular';

export default angular.module('dashboard', [
	'ngRoute',
	'uib/template/tooltip/tooltip-popup.html',
	'ui.bootstrap.tooltip',
	'app.directives'
]).config([
	'$compileProvider', function($compileProvider)	{
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
	}
]);
