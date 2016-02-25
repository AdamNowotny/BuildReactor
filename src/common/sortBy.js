/* eslint no-nested-ternary: 0 */

define(function() {

	'use strict';
	
	return function(propertyName, json) {
		json.sort(function(a, b) {
			return a[propertyName] < b[propertyName] ?
				-1 :
				a[propertyName] > b[propertyName] ? 1 : 0;
		});
	};

});
