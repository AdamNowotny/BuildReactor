define([
	'services/bamboo/bambooPlan',
	'services/request',
	'rx'
], function (BambooPlan, request, Rx) {

	'use strict';

	describe('services/bamboo/BambooPlan', function () {

		var build;
		var planJson;
		var resultJson;
		var settings;
		var mockPlan;
		var mockLatestResult;
		
		beforeEach(function () {
			settings = {
				url: 'http://example.com/',
				username: 'username1',
				password: 'password1'
			};
			planJson = JSON.parse(readFixtures('src/services/bamboo/plan.fixture.json'));
			resultJson = JSON.parse(readFixtures('src/services/bamboo/latestPlanResult.fixture.json'));
			var callCount = 0;
			spyOn(request, 'json').andCallFake(function () {
				callCount++;
				switch (callCount) {
				case 1:
					return Rx.Observable.returnValue(planJson);
				case 2:
					return Rx.Observable.returnValue(resultJson);
				}
			});
			build = new BambooPlan('KEY', settings);
		});

		it('should make calls on update', function () {
			build.update();

			expect(request.json).toHaveBeenCalled();
			expect(request.json.calls[0].args[0].url).toBe('http://example.com/rest/api/latest/plan/KEY');
			expect(request.json.calls[0].args[0].username).toBe(settings.username);
			expect(request.json.calls[0].args[0].password).toBe(settings.password);
			expect(request.json.calls[0].args[0].authCookie).toBe('JSESSIONID');
			expect(request.json.calls[1].args[0].url).toBe('http://example.com/rest/api/latest/result/KEY/latest?expand=changes');
		});

		it('should parse response and return current state', function () {
			build.update().subscribe(function (state) {
				expect(state.id).toBe('KEY');
				expect(state.name).toBe('Deploy Nightly Trunk');
				expect(state.webUrl).toBe('http://example.com/browse/PROJECT1-PLAN1-3631');
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
				expect(state.isWaiting).toBe(false);
				expect(state.isDisabled).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isBroken', function () {
			resultJson.state = 'Failed';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isBroken to false on successful build', function () {
			resultJson.state = 'Successful';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isRunning', function () {
			planJson.isBuilding = true;

			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should not set isRunning if it is not', function () {
			planJson.isBuilding = false;

			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isDisabled if build disabled', function () {
			planJson.enabled = false;

			build.update().subscribe(function (state) {
				expect(state.isDisabled).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set Unknown tag if status unknown', function () {
			resultJson.state = 'unknown_status';

			build.update().subscribe(function (state) {
				expect(state.tags).toContain({name: 'Unknown', description: 'State [unknown_status] is unknown'});
				expect(state.isBroken).not.toBeDefined();
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set changes', function () {
			build.update().subscribe(function (state) {
				expect(state.changes).toEqual([{ name: 'Adam Nowotny' }]);
			});

			expect(request.json).toHaveBeenCalled();
		});

	});
});