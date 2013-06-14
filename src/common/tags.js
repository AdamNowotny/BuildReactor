define(function () {

	'use strict';

	var contains = function (tags, tagName) {
		return tags && tags.reduce(function (agg, value) {
			return agg || value.name === tagName; 
		}, false);
	};

	return {
		contains: contains
	};
});