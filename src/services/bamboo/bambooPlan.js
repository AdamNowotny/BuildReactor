define([
	'signals',
	'./bambooRequest',
	'common/joinUrl',
	'jquery',
	'services/build'
], function (Signal, BambooRequest, joinUrl, $, Build) {

	'use strict';

	var BambooPlan = function (id, settings) {
		$.extend(this, new Build(id, settings));
	};

	BambooPlan.prototype.update = function () {
		var plan = this;
		var completed = new Signal();
		completed.memorize = true;
		updatePlanDetails(plan).addOnce(function (result) {
			if (result.error) {
				plan.on.errorThrown.dispatch(plan);
				completed.dispatch(plan);
			} else if (plan.isEnabled) {
				updateLastResult(plan).addOnce(function (result) {
					if (result.error) {
						plan.on.errorThrown.dispatch(plan);
					}
					completed.dispatch(plan);
				});
			}
		});
		return completed;
	};

	function processEvents(plan, response) {
		if (!plan.isRunning && response.isBuilding) {
			plan.on.started.dispatch(plan);
		}
		if (plan.isRunning && !response.isBuilding) {
			plan.on.finished.dispatch(plan);
		}
	}

	function activateEvents(plan, active) {
		plan.on.broken.active = active;
		plan.on.fixed.active = active;
		plan.on.started.active = active;
		plan.on.finished.active = active;
	}

	function updatePlanDetails(plan) {

		function processResponse(response) {
			try {
				if (!response.key) { throw { name: 'ArgumentInvalid', message: 'response.key is undefined' }; }
				activateEvents(plan, response.enabled);
				plan.projectName = response.projectName;
				plan.name = response.shortName;
				plan.isEnabled = response.enabled;
				processEvents(plan, response);
				plan.isRunning = response.isBuilding;
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
		request.plan(plan.id);
		return completed;
	}

	function updateLastResult(plan) {
		
		function processResponse(response) {
			try {
				plan.buildNumber = response.number;
				plan.webUrl = joinUrl(plan.settings.url, 'browse/' + response.key);
				if (!plan.isBroken && response.state === 'Failed') {
					plan.isBroken = true;
					plan.on.broken.dispatch(plan);
				}
				if (plan.isBroken && response.state === 'Successful') {
					plan.isBroken = false;
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
		request.latestPlanResult(plan.id);
		return completed;
	}

	return BambooPlan;
});