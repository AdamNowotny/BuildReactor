import 'angular-route';
import 'angular-ui-bootstrap';
import 'common/directives/buildList/buildList';
import angular from 'angular';

export default angular.module('popup', [
	'ngRoute',
	'ui.bootstrap.tooltip',
	'uib/template/tooltip/tooltip-popup.html',
	'app.directives'
]).config([
	'$compileProvider', function($compileProvider)	{
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
	}
]);
