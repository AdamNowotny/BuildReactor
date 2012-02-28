define(function () {

	var saveClicked = new signals.Signal();
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
		saveClicked: saveClicked
	};
});