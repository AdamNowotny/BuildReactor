define(['signals', 'bamboo/bambooRequest'], function (signals, BambooRequest) {

	'use strict';

	var BambooPlan = function (settings) {
		this.settings = settings;
		this.buildFailed = new signals.Signal();
		this.buildFixed = new signals.Signal();
		this.errorThrown = new signals.Signal();
	};

	BambooPlan.prototype.initialize = function (responsePlan) {
		if (!responsePlan.key) { throw { name: 'ArgumentInvalid', message: 'responsePlan.key is undefined' }; }
		this.state = 'Successful';
		this.key = responsePlan.key;
		this.projectName = responsePlan.projectName;
		this.name = responsePlan.shortName;
		this.isEnabled = responsePlan.enabled;
		this.isBuilding = responsePlan.isBuilding;
		this.isActive = responsePlan.isActive;
		this.url = responsePlan.link.href;
	};

	BambooPlan.prototype.update = function () {
		var self = this;
		
		function processResponse(response) {
			try {
				self.buildNumber = response.number;
				if (self.state !== 'Failed' && response.state === 'Failed') {
					self.state = 'Failed';
					self.buildFailed.dispatch(self);
				}
				if (self.state === 'Failed' && response.state === 'Successful') {
					self.state = 'Successful';
					self.buildFixed.dispatch(self);
				}
				updateFinished.dispatch(true, response);
			} catch (e) {
				self.errorThrown.dispatch(e);
				updateFinished.dispatch(false, e);
			}
		}

		function processError(ajaxError) {
			self.errorThrown.dispatch(ajaxError);
			updateFinished.dispatch(false, ajaxError);
		}
		
		var updateFinished = new signals.Signal();
		updateFinished.memorize = true;
		var request = new BambooRequest(this.settings);
		request.responseReceived.addOnce(processResponse, this);
		request.errorReceived.addOnce(processError, this);
		request.latestPlanResult(this.key);
		return updateFinished;
	};

	return BambooPlan;
});