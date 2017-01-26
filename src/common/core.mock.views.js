define(['rx'], function(Rx) {

	'use strict';

	return Rx.Observable.return({
		columns: 3,
		fullWidthGroups: true,
		showCommits: true,
		theme: 'dark'
	});
});
