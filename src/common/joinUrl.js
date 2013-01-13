define(['mout/string/endsWith'], function (endsWith) {

	'use strict';
	
	return function (root, path) {
		var fullRoot = root;
		if (path && !endsWith(root, '/')) {
			fullRoot += '/';
		}
		return fullRoot + path;
	};
});