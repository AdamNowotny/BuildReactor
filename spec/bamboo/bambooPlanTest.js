define([
		'bamboo/bambooPlan',
		'bamboo/bambooRequest',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json',
		'json!spec/fixtures/bamboo/latestPlanResult.json',
		'json!spec/fixtures/bamboo/latestPlanResultFailed.json'
	], function (BambooPlan, BambooRequest, jasmineSignals, projects, latestPlanResultJson, latestPlanResultFailedJson) {

		'use strict';

		describe('BambooPlan', function () {

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
					this.responseReceived.dispatch(json);
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
				expect(newPlan.url).toBe('https://example.com/rest/api/latest/plan/PROJECT1-PLAN1');
			});

			it('should set last build number on update', function () {
				setupResponse(latestPlanResultJson);

				plan.update();

				expect(plan.buildNumber).toBe(3631);
			});

			it('should signal buildFailed on update', function () {
				var buildFailedSpy = spyOnSignal(plan.buildFailed).matchingValues(plan);
				setupResponse(latestPlanResultFailedJson);

				plan.update();

				expect(buildFailedSpy).toHaveBeenDispatched(1);
			});

			it('should not signal buildFailed if not changed', function () {
				var buildFailedSpy = spyOnSignal(plan.buildFailed).matchingValues(plan);
				setupResponse(latestPlanResultFailedJson);

				plan.update();
				expect(buildFailedSpy).toHaveBeenDispatched(1);

				plan.update();
				expect(buildFailedSpy).toHaveBeenDispatched(1);
			});

			it('should signal when build is fixed', function () {
				var buildFixedSpy = spyOnSignal(plan.buildFixed).matchingValues(plan);
				setupResponse(latestPlanResultFailedJson);
				plan.update();

				setupResponse(latestPlanResultJson);
				plan.update();

				expect(buildFixedSpy).toHaveBeenDispatched(1);
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

			it('should signal error and updateFinished when error response received', function () {
				var errorThrownSpy = spyOnSignal(plan.errorThrown);
				mockBambooRequest.andCallFake(function (key) {
					this.errorReceived.dispatch();
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

			it('should signal error and updateFinished when parsing response fails', function () {
				var errorThrownSpy = spyOnSignal(plan.errorThrown);
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