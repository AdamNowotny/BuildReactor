define([
        './bambooRequest',
        'signals'
    ], function (BambooRequest, signals) {

        var BambooPlan = function (settings) {
            this.settings = settings;
            this.buildFailed = new signals.Signal();
            this.buildFixed = new signals.Signal();
            this.errorThrown = new signals.Signal();
        };

        BambooPlan.prototype.initialize = function (responsePlan) {
            Contract.expectString(responsePlan.key, 'Plan key unknown');
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
            var updateFinished = new signals.Signal();
            updateFinished.memorize = true;
            var request = new BambooRequest(this.settings);
            request.responseReceived.addOnce(processResponse, this);
            request.errorReceived.addOnce(processError, this);
            request.latestPlanResult(this.key);
            return updateFinished;
            
            function processResponse(response) {
                try {
                    this.buildNumber = response.number;
                    if (this.state !== 'Failed' && response.state === 'Failed') {
                        this.state = 'Failed';
                        this.buildFailed.dispatch(this);
                    }
                    if (this.state === 'Failed' && response.state === 'Successful') {
                        this.state = 'Successful';
                        this.buildFixed.dispatch(this);
                    }
                    updateFinished.dispatch(true, response);
                } catch (e) {
                    this.errorThrown.dispatch(e);
                    updateFinished.dispatch(false, e);
                }
            }

            function processError(ajaxError) {
                this.errorThrown.dispatch(ajaxError);
                updateFinished.dispatch(false, ajaxError);
            }
        };

        return BambooPlan;
    });