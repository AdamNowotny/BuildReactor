import 'angular-route';
import 'common/directives/buildList/buildList';
import angular from 'angular';
import tooltip from 'angular-ui-bootstrap/src/tooltip/index-nocss.js';

export default angular.module('dashboard', [
	'ngRoute',
	tooltip,
	'app.directives'
]).config([
	'$compileProvider', function($compileProvider)	{
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|moz-extension):/);
	}
]);
