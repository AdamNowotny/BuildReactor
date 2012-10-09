define(['signals', './bambooRequest', 'urljs'], function (signals, BambooRequest, URL) {

	'use strict';

	var BambooPlan = function (settings) {
		this.settings = settings;
		this.on = {
			failed: new signals.Signal(),
			fixed: new signals.Signal(),
			errorThrown: new signals.Signal()
		};
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
	};

	BambooPlan.prototype.update = function () {
		var self = this;
		
		function processResponse(response) {
			try {
				self.buildNumber = response.number;
				self.url = URL.resolve(self.settings.url, 'browse/' + response.key);
				if (self.state !== 'Failed' && response.state === 'Failed') {
					self.state = 'Failed';
					self.on.failed.dispatch(self);
				}
				if (self.state === 'Failed' && response.state === 'Successful') {
					self.state = 'Successful';
					self.on.fixed.dispatch(self);
				}
				updated.dispatch(true, response);
			} catch (e) {
				self.on.errorThrown.dispatch(e);
				updated.dispatch(false, e);
			}
		}

		function processError(ajaxError) {
			self.on.errorThrown.dispatch(ajaxError);
			updated.dispatch(false, ajaxError);
		}
		
		var updated = new signals.Signal();
		updated.memorize = true;
		var request = new BambooRequest(this.settings);
		request.on.responseReceived.addOnce(processResponse, this);
		request.on.errorReceived.addOnce(processError, this);
		request.latestPlanResult(this.key);
		return updated;
	};

	return BambooPlan;
});