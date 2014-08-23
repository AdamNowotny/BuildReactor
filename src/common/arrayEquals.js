define(function () {
	'use strict';

	return function (array1, array2) {
		array1 = array1 || [];
		array2 = array2 || [];
		return array1.join('_') === array2.join('_');
	};
});
