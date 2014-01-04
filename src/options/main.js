require.config({
	baseUrl: 'src',
});

require(['common/main'], function (common) {
	'use strict';
	require(['common/main-web'], function (common) {
		require(['options/main-app']);
	});
});
