define([
	'core/services/buildbot/buildbotBuild',
	'core/services/request',
	'rx',
	'text!core/services/buildbot/builder.fixture.json',
	'text!core/services/buildbot/lastCompleted.fixture.json'
], function (Build, request, Rx, builderFixture, lastCompletedBuildFixture) {
	'use strict';

	describe('core/services/buildbot/buildbotBuild', function () {

		var build;
		var settings;
		var builderJson;
		var lastCompletedBuildJson;

		beforeEach(function () {
			settings = {
				url: 'http://example.com'
			};
			builderJson = JSON.parse(builderFixture);
			lastCompletedBuildJson = JSON.parse(lastCompletedBuildFixture);
			var callCount = 0;
			spyOn(request, 'json').andCallFake(function () {
				callCount++;
				switch (callCount) {
				case 1:
					return Rx.Observable.returnValue(builderJson);
				case 2:
					return Rx.Observable.returnValue(lastCompletedBuildJson);
				}
			});
			build = new Build('build_id', settings);
		});

		it('should make calls on update', function () {
			build.update();

			expect(request.json).toHaveBeenCalled();
			expect(request.json.calls[0].args[0].url).toBe('http://example.com/json/builders/build_id');
			expect(request.json.calls[0].args[0].username).toBe(settings.username);
			expect(request.json.calls[0].args[0].password).toBe(settings.password);
			expect(request.json.calls[1].args[0].url).toBe('http://example.com/json/builders/build_id/builds/-1');
		});

		it('should parse response and return current state', function () {
			build.update().subscribe(function (state) {
				expect(state.id).toBe('build_id');
				expect(state.name).toBe('build_id');
				expect(state.webUrl).toBe('http://example.com/builders/build_id');
				expect(state.isBroken).toBe(true);
				expect(state.isRunning).toBe(false);
				expect(state.isDisabled).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isBroken', function () {
			lastCompletedBuildJson.text.push = 'failed';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});
		
		it('should not set isBroken on successful build', function () {
			lastCompletedBuildJson.text = [];

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isRunning', function () {
			builderJson.state = 'building';

			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should not set isRunning if it is not', function () {
			builderJson.state = 'idle';

			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isDisabled if build disabled', function () {
			builderJson.state = 'offline';

			build.update().subscribe(function (state) {
				expect(state.isDisabled).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set changes', function () {
			build.update().subscribe(function (state) {
				expect(state.changes).toEqual([{ name: 'Dustin J. Mitchell <dustin@mozilla.com>' }, { name: 'Elmir Jagudin <elmir@axis.com>' }]);
			});

			expect(request.json).toHaveBeenCalled();
		});

	});

});