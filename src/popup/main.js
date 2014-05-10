require.config({
	baseUrl: 'src',
});

require(['common/main'], function (common) {
	'use strict';
	require(['common-ui/main'], function () {
		require(['popup/main-app']);
	});
});
