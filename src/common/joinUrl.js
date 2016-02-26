/* eslint no-param-reassign: 0 */

define([
	'mout/string/endsWith',
	'mout/string/startsWith'
], function(endsWith, startsWith) {

	'use strict';
	
	return function(root, path) {
		var fullRoot = root;
		if (path && startsWith(path, '/')) {
			path = path.substring(1, path.length);
		}
		if (path && !endsWith(root, '/')) {
			fullRoot += '/';
		}
		return fullRoot + path;
	};
});
