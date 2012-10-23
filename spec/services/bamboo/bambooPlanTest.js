define([
		'services/bamboo/bambooPlan',
		'services/bamboo/bambooRequest',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json',
		'json!spec/fixtures/bamboo/latestPlanResult.json',
		'json!spec/fixtures/bamboo/latestPlanResultFailed.json'
	], function (BambooPlan, BambooRequest, jasmineSignals, projects, latestPlanResultJson, latestPlanResultFailedJson) {

		'use strict';

		describe('services/bamboo/BambooPlan', function () {

			var plan;
			var settings;
			var planJson = projects.projects.project[0].plans.plan[0];
			var mockBambooRequest;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			
			beforeEach(function () {
				settings = {
					url: 'http://example.com/',
					username: 'username1',
					password: 'password1'
				};
				plan = new BambooPlan(settings);
				plan.initialize(planJson);
				mockBambooRequest = spyOn(BambooRequest.prototype, 'latestPlanResult');
			});

			function setupResponse(json) {
				mockBambooRequest.andCallFake(function (key) {
					this.on.responseReceived.dispatch(json);
				});
			}

			it('should set properties on initialize', function () {
				var newPlan = new BambooPlan(settings);

				newPlan.initialize(planJson);

				expect(newPlan.key).toBe('PROJECT1-PLAN1');
				expect(newPlan.projectName).toBe('Project 1');
				expect(newPlan.name).toBe('Plan 1');
				expect(newPlan.isEnabled).toBe(true);
				expect(newPlan.isBuilding).toBe(false);
				expect(newPlan.isActive).toBe(false);
			});

			it('should set last build number on update', function () {
				setupResponse(latestPlanResultJson);

				plan.update();

				expect(plan.buildNumber).toBe(3631);
			});

			it('should set build url on update', function () {
				setupResponse(latestPlanResultJson);

				plan.update();

				expect(plan.url).toBe('http://example.com/browse/PROJECT1-PLAN1-3631');
			});

			it('should signal failed on update', function () {
				var buildFailedSpy = spyOnSignal(plan.on.failed);
				setupResponse(latestPlanResultFailedJson);

				plan.update();

				expect(buildFailedSpy).toHaveBeenDispatchedWith(plan);
			});

			it('should not signal failed if not changed', function () {
				var buildFailedSpy = spyOnSignal(plan.on.failed);
				setupResponse(latestPlanResultFailedJson);

				plan.update();
				expect(buildFailedSpy).toHaveBeenDispatchedWith(plan);

				plan.update();
				expect(buildFailedSpy).toHaveBeenDispatchedWith(plan);
			});

			it('should signal when build is fixed', function () {
				spyOnSignal(plan.on.fixed);
				setupResponse(latestPlanResultFailedJson);
				plan.update();

				setupResponse(latestPlanResultJson);
				plan.update();

				expect(plan.on.fixed).toHaveBeenDispatchedWith(plan);
			});

			xit('should signal when build is started', function () {
				spyOnSignal(plan.on.started);
				setupResponse(latestPlanResultJson);
				plan.update();

				setupResponse(latestPlanResultJson);
				plan.update();

				expect(plan.on.fixed).toHaveBeenDispatchedWith(plan);
			});

			it('should signal success when response received', function () {
				setupResponse(latestPlanResultJson);

				var finished = false;
				var success = false;
				plan.update().addOnce(function (status, result) {
					finished = true;
					success = status;
				});

				expect(finished).toBe(true);
				expect(success).toBe(true);
			});

			describe('error', function () {
	
				it('should signal error when error response received', function () {
					var errorThrownSpy = spyOnSignal(plan.on.errorThrown);
					mockBambooRequest.andCallFake(function (key) {
						this.on.errorReceived.dispatch();
					});

					var finished = false;
					var success = false;
					plan.update().addOnce(function (status, errorInfo) {
						finished = true;
						success = status;
					});

					expect(finished).toBe(true);
					expect(errorThrownSpy).toHaveBeenDispatched(1);
					expect(success).toBe(false);
				});

				it('should signal error when parsing response fails', function () {
					var errorThrownSpy = spyOnSignal(plan.on.errorThrown);
					setupResponse(null);

					var finished = false;
					var success = false;
					plan.update().addOnce(function (status, errorInfo) {
						finished = true;
						success = status;
					});

					expect(finished).toBe(true);
					expect(errorThrownSpy).toHaveBeenDispatched(1);
					expect(success).toBe(false);
				});
			});
	
		});
	});