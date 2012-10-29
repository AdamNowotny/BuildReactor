define(['signals', './bambooRequest', 'urljs'], function (Signal, BambooRequest, URL) {

	'use strict';

	var BambooPlan = function (settings, key) {
		this.key = key;
		this.settings = settings;
		this.on = {
			failed: new Signal(),
			fixed: new Signal(),
			started: new Signal(),
			finished: new Signal(),
			errorThrown: new Signal()
		};
	};

	BambooPlan.prototype.initialize = function (responsePlan) {
		if (!responsePlan.key) { throw { name: 'ArgumentInvalid', message: 'responsePlan.key is undefined' }; }
		this.state = 'Successful';
	};

	BambooPlan.prototype.update = function () {
		var plan = this;
		var updated = new Signal();
		updated.memorize = true;
		updatePlanDetails(plan).addOnce(function (result) {
			if (result.error) {
				plan.on.errorThrown.dispatch(result.error);
				updated.dispatch(plan);
			} else if (plan.isEnabled) {
				updateLastResult(plan).addOnce(function (result) {
					if (result.error) {
						plan.on.errorThrown.dispatch(result.error);
					}
					updated.dispatch(plan);
				});
			}
		});
		return updated;
	};

	function processEvents(plan, response) {
		if (plan.isBuilding === false && response.isBuilding) {
			plan.on.started.dispatch(plan);
		}
		if (plan.isBuilding === true && !response.isBuilding) {
			plan.on.finished.dispatch(plan);
		}
	}

	function activateEvents(plan, active) {
		plan.on.failed.active = active;
		plan.on.fixed.active = active;
		plan.on.started.active = active;
		plan.on.finished.active = active;
	}

	function updatePlanDetails(plan) {

		function processResponse(response) {
			try {
				if (!response.key) { throw { name: 'ArgumentInvalid', message: 'response.key is undefined' }; }
				activateEvents(plan, response.enabled);
				plan.key = response.key;
				plan.projectName = response.projectName;
				plan.name = response.shortName;
				plan.isEnabled = response.enabled;
				processEvents(plan, response);
				plan.isBuilding = response.isBuilding;
				plan.isActive = response.isActive;
				completed.dispatch({ result: response });
			} catch (e) {
				completed.dispatch({ error: e });
			}
		}

		function processError(ajaxError) {
			completed.dispatch({ error: ajaxError || {} });
		}

		var completed = new Signal();
		completed.memorize = true;
		var request = new BambooRequest(plan.settings);
		request.on.responseReceived.addOnce(processResponse, plan);
		request.on.errorReceived.addOnce(processError, plan);
		request.plan(plan.key);
		return completed;
	}

	function updateLastResult(plan) {
		
		function processResponse(response) {
			try {
				plan.buildNumber = response.number;
				plan.url = URL.resolve(plan.settings.url, 'browse/' + response.key);
				if (plan.state !== 'Failed' && response.state === 'Failed') {
					plan.state = 'Failed';
					plan.on.failed.dispatch(plan);
				}
				if (plan.state === 'Failed' && response.state === 'Successful') {
					plan.state = 'Successful';
					plan.on.fixed.dispatch(plan);
				}
				completed.dispatch({ result: response });
			} catch (e) {
				completed.dispatch({ error: e });
			}
		}

		function processError(ajaxError) {
			completed.dispatch({ error: ajaxError || {} });
		}
		

		var completed = new Signal();
		completed.memorize = true;
		var request = new BambooRequest(plan.settings);
		request.on.responseReceived.addOnce(processResponse, plan);
		request.on.errorReceived.addOnce(processError, plan);
		request.latestPlanResult(plan.key);
		return completed;
	}

	return BambooPlan;
});