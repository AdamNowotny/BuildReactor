define(['handlebars'], function (Handlebars) {
	'use strict';

	var isDefined = function (property, block) {
		return (property !== undefined) ? block.fn(this) : block.inverse(this);
	};

	Handlebars.registerHelper('isDefined', isDefined);
	return isDefined;
});