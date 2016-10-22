define(function() {

	'use strict';

	var contains = function(tagName, tags) {
		return tags && tags.reduce(function(agg, value) {
			return agg || value.name === tagName;
		}, false);
	};

	return {
		contains: contains
	};
});
