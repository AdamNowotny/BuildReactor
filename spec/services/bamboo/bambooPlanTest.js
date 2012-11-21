define([
		'services/bamboo/bambooPlan',
		'services/bamboo/bambooRequest',
		'jasmineSignals'
	], function (BambooPlan, BambooRequest, spyOnSignal) {

		'use strict';

		describe('services/bamboo/BambooPlan', function () {

			var plan;
			var planJson;
			var latestPlanResultJson;
			var settings;
			var mockPlan;
			var mockLatestResult;
			
			beforeEach(function () {
				settings = {
					url: 'http://example.com/',
					username: 'username1',
					password: 'password1'
				};
				planJson = JSON.parse(readFixtures('bamboo/plan.json'));
				latestPlanResultJson = JSON.parse(readFixtures('bamboo/latestPlanResult.json'));
				mockPlan = spyOn(BambooRequest.prototype, 'plan');
				mockLatestResult = spyOn(BambooRequest.prototype, 'latestPlanResult');
				plan = new BambooPlan(settings, 'KEY');
			});

			describe('update plan details', function () {

				it('should have key', function () {
					expect(plan.id).toBe('KEY');
				});

				it('should get plan details', function () {
					plan.update();

					expect(BambooRequest.prototype.plan).toHaveBeenCalled();
				});

				it('should update plan details', function () {
					mockPlan.andCallFake(function () {
						this.on.responseReceived.dispatch(planJson);
					});

					plan.update();

					expect(plan.projectName).toBe('Nightly Builds');
					expect(plan.name).toBe('Deploy Nightly Trunk');
					expect(plan.isEnabled).toBe(true);
					expect(plan.isRunning).toBe(false);
					expect(plan.isActive).toBe(false);
				});

				it('should signal error once if getting plan details failed', function () {
					spyOnSignal(plan.on.errorThrown);
					mockPlan.andCallFake(function () {
						this.on.errorReceived.dispatch();
					});

					plan.update();

					expect(plan.on.errorThrown).toHaveBeenDispatched(1);
				});

				it('should not get latest results if getting plan details failed', function () {
					mockPlan.andCallFake(function () {
						this.on.errorReceived.dispatch();
					});

					plan.update();

					expect(mockLatestResult).not.toHaveBeenCalled();
				});

				it('should signal completion when call failed', function () {
					mockPlan.andCallFake(function () {
						this.on.errorReceived.dispatch();
					});
					var isCompleted = false;
					plan.update().addOnce(function (result) {
						expect(result).toBe(plan);
						isCompleted = true;
					});

					expect(isCompleted).toBe(true);
				});

				it('should signal when build started', function () {
					spyOnSignal(plan.on.started);
					mockPlan.andCallFake(function () {
						planJson.isBuilding = false;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();

					mockPlan.andCallFake(function () {
						planJson.isBuilding = true;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();

					expect(plan.on.started).toHaveBeenDispatched();
					expect(plan.on.started).toHaveBeenDispatchedWith(plan);
				});

				it('should not signal started if plan not active', function () {
					planJson.enabled = false;
					mockPlan.andCallFake(function () {
						planJson.isBuilding = false;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();
					spyOnSignal(plan.on.started);

					mockPlan.andCallFake(function () {
						planJson.isBuilding = true;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();

					expect(plan.on.started).not.toHaveBeenDispatched();
				});

				it('should signal when build finished', function () {
					spyOnSignal(plan.on.finished);
					mockPlan.andCallFake(function () {
						planJson.isBuilding = true;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();

					mockPlan.andCallFake(function () {
						planJson.isBuilding = false;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();

					expect(plan.on.finished).toHaveBeenDispatchedWith(plan);
				});

				it('should not signal when build finished if plan not active', function () {
					planJson.enabled = false;
					mockPlan.andCallFake(function () {
						planJson.isBuilding = true;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();
					spyOnSignal(plan.on.finished);

					mockPlan.andCallFake(function () {
						planJson.isBuilding = false;
						this.on.responseReceived.dispatch(planJson);
					});
					plan.update();

					expect(plan.on.finished).not.toHaveBeenDispatched();
				});

				it('should signal error if parsing response fails', function () {
					spyOnSignal(plan.on.errorThrown);
					mockPlan.andCallFake(function () {
						this.on.responseReceived.dispatch(this);
					});

					plan.update();

					expect(plan.on.errorThrown).toHaveBeenDispatched();
				});

				it('should signal completion if parsing response fails', function () {
					spyOnSignal(plan.on.errorThrown);
					mockPlan.andCallFake(function () {
						this.on.responseReceived.dispatch(null);
					});

					var completed = false;
					plan.update().addOnce(function () {
						completed = true;
					});

					expect(completed).toBe(true);
				});
			});

			describe('update last results', function () {

				beforeEach(function () {
					mockPlan.andCallFake(function () {
						this.on.responseReceived.dispatch(planJson);
					});
				});

				it('should not get last result if not active', function () {
					planJson.enabled = false;

					plan.update();

					expect(mockLatestResult).not.toHaveBeenCalled();
				});

				it('should signal error once if getting last results failed', function () {
					spyOnSignal(plan.on.errorThrown);
					mockPlan.andCallFake(function () {
						this.on.responseReceived.dispatch(planJson);
					});
					mockLatestResult.andCallFake(function () {
						this.on.errorReceived.dispatch();
					});

					plan.update();

					expect(plan.on.errorThrown).toHaveBeenDispatched(1);
				});

				it('should set last build number on update', function () {
					mockLatestResult.andCallFake(function () {
						this.on.responseReceived.dispatch(latestPlanResultJson);
					});

					plan.update();

					expect(plan.buildNumber).toBe(3631);
				});

				it('should set build url on update', function () {
					mockLatestResult.andCallFake(function () {
						this.on.responseReceived.dispatch(latestPlanResultJson);
					});

					plan.update();

					expect(plan.webUrl).toBe('http://example.com/browse/PROJECT1-PLAN1-3631');
				});

				it('should signal build broken on update', function () {
					spyOnSignal(plan.on.broken);
					mockLatestResult.andCallFake(function () {
						latestPlanResultJson.state = 'Failed';
						this.on.responseReceived.dispatch(latestPlanResultJson);
					});

					plan.update();

					expect(plan.on.broken).toHaveBeenDispatchedWith(plan);
				});

				it('should not signal broken if not changed', function () {
					spyOnSignal(plan.on.broken);
					mockLatestResult.andCallFake(function () {
						latestPlanResultJson.state = 'Failed';
						this.on.responseReceived.dispatch(latestPlanResultJson);
					});

					plan.update();
					expect(plan.on.broken).toHaveBeenDispatchedWith(plan);

					plan.update();
					expect(plan.on.broken).toHaveBeenDispatchedWith(plan);
				});

				it('should signal when build is fixed', function () {
					spyOnSignal(plan.on.fixed);
					mockLatestResult.andCallFake(function () {
						latestPlanResultJson.state = 'Failed';
						this.on.responseReceived.dispatch(latestPlanResultJson);
					});
					plan.update();

					mockLatestResult.andCallFake(function () {
						latestPlanResultJson.state = 'Successful';
						this.on.responseReceived.dispatch(latestPlanResultJson);
					});
					plan.update();

					expect(plan.on.fixed).toHaveBeenDispatchedWith(plan);
				});

				it('should signal completion when response received', function () {
					mockLatestResult.andCallFake(function () {
						this.on.responseReceived.dispatch(latestPlanResultJson);
					});

					var completed;
					plan.update().addOnce(function (plan) {
						completed = true;
					});

					expect(completed).toBe(true);
				});

				it('should signal error if parsing response fails', function () {
					spyOnSignal(plan.on.errorThrown);
					mockLatestResult.andCallFake(function () {
						this.on.responseReceived.dispatch(null);
					});

					plan.update();

					expect(plan.on.errorThrown).toHaveBeenDispatched();
				});

				it('should signal completion if parsing response fails', function () {
					spyOnSignal(plan.on.errorThrown);
					mockLatestResult.andCallFake(function () {
						this.on.responseReceived.dispatch(null);
					});

					var completed = false;
					plan.update().addOnce(function () {
						completed = true;
					});

					expect(completed).toBe(true);
				});

			});
	
		});
	});