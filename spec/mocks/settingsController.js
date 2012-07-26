define(['signals'], function (signals) {

	'use strict';
	
	var settingsChanged = new signals.Signal();
	var showCalledCount = 0;

	function show(settings) {
		showCalledCount++;
	}

	function getShowCalledCount() {
		return showCalledCount;
	}
	return {
		show: show,
		getShowCalledCount: getShowCalledCount,
		settingsChanged: settingsChanged
	};
});