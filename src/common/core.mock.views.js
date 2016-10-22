define(['rx'], function(Rx) {

	'use strict';

	return Rx.Observable.returnValue({
		columns: 3,
		fullWidthGroups: true,
		showCommits: true,
		theme: 'dark'
	});
});
