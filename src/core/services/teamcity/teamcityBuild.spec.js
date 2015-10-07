define([
	'core/services/teamcity/teamcityBuild',
	'core/services/request',
	'rx',
	'text!core/services/teamcity/build.fixture.json',
	'text!core/services/teamcity/buildList.fixture.json',
	'text!core/services/teamcity/buildListRunning.fixture.json',
	'text!core/services/teamcity/changes.fixture.json',
	'text!core/services/teamcity/changes_id.fixture.json'
], function (Build, request, Rx, buildFixture, buildListFixture, buildListRunningFixture, changesFixture, changeFixture) {
	'use strict';

	describe('core/services/teamcity/teamcityBuild', function () {

		var build;
		var settings;
		var buildListJson, buildListRunningJson, buildJson, changesJson, changeJson;

		beforeEach(function () {
			settings = {
				url: 'http://example.com'
			};
			buildJson = JSON.parse(buildFixture);
			buildListJson = JSON.parse(buildListFixture);
			buildListRunningJson = JSON.parse(buildListRunningFixture);
			changesJson = JSON.parse(changesFixture);
			changeJson = JSON.parse(changeFixture);
			spyOn(request, 'json').andCallFake(function (options) {
				switch (options.url) {
				case 'http://example.com/guestAuth/app/rest/changes?build=id:63887':
					return Rx.Observable.returnValue(changesJson);
				case 'http://example.com/guestAuth/app/rest/changes/id:68396':
					return Rx.Observable.returnValue(changeJson);
				case 'http://example.com/guestAuth/app/rest/changes/id:43196':
					return Rx.Observable.returnValue(changeJson);
				case 'http://example.com/guestAuth/app/rest/builds?locator=buildType:build_id,running:any,branch:(refs/heads/master)':
					return Rx.Observable.returnValue(buildListRunningJson);
				case 'http://example.com/guestAuth/app/rest/builds?locator=buildType:build_id,running:any':
					return Rx.Observable.returnValue(buildListJson);
				case 'http://example.com/httpAuth/app/rest/builds?locator=buildType:build_id,running:any':
					return Rx.Observable.returnValue(buildListJson);
				case 'http://example.com/guestAuth/app/rest/builds/id:18':
					return Rx.Observable.returnValue(buildJson);
				case 'http://example.com/httpAuth/app/rest/builds/id:18':
					return Rx.Observable.returnValue(buildJson);
				default:
					throw 'Unknown URL ' + options.url;
				}
			});

			build = new Build('build_id', settings);
		});

		it('should make call on update for guest', function () {
			build.update().subscribe();

			expect(request.json).toHaveBeenCalled();
			expect(request.json.calls[0].args[0].url).toBe('http://example.com/guestAuth/app/rest/builds?locator=buildType:build_id,running:any');
			expect(request.json.calls[1].args[0].url).toBe('http://example.com/guestAuth/app/rest/builds/id:18');
		});

		it('should make call on update specifying the branch', function () {
			settings.branch = 'refs/heads/master';

			build.update().subscribe();

			expect(request.json).toHaveBeenCalled();
			expect(request.json.calls[0].args[0].url).toBe('http://example.com/guestAuth/app/rest/builds?locator=buildType:build_id,running:any,branch:(refs/heads/master)');
			expect(request.json.calls[1].args[0].url).toBe('http://example.com/guestAuth/app/rest/builds/id:18');
		});

		it('should add httpAuth for initial call on update for registered user', function () {
			settings.username = 'username';
			settings.password = 'password';

			build.update().subscribe();

			expect(request.json).toHaveBeenCalled();
			expect(request.json.calls[0].args[0].url).toBe('http://example.com/httpAuth/app/rest/builds?locator=buildType:build_id,running:any');
			expect(request.json.calls[0].args[0].username).toBe('username');
			expect(request.json.calls[0].args[0].password).toBe('password');
		});


		it('should parse response and return current state', function () {
			build.update().subscribe(function (state) {
				expect(state.id).toBe('build_id');
				expect(state.name).toBe('Build');
				expect(state.group).toBe('Amazon API client');
				expect(state.webUrl).toBe('http://teamcity.jetbrains.com/viewLog.html?buildId=63887&buildTypeId=bt297');
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should push error if branch not found', function () {
			settings.branch = 'refs/heads/master';
			buildListRunningJson = { count: 0, build: [] };

			build.update().subscribe(function (state) {
				throw new Error('Error expected');
			}, function (ex) {
				expect(ex.name).toEqual('NotFoundError');
				expect(ex.message).toEqual('No build for branch [refs/heads/master]');
			});
		});

		it('should set isBroken on FAILURE', function () {
			buildJson.status = 'FAILURE';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
			});
		});

		it('should set isBroken on ERROR', function () {
			buildJson.status = 'ERROR';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
			});
		});

		it('should set isBroken to false on successful build', function () {
			buildJson.status = 'SUCCESS';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
			});
		});

		it('should tag Unknown if status unknown', function () {
			buildJson.status = 'unknown_status';

			build.update().subscribe(function (state) {
				expect(state.tags).toContain({name: 'Unknown', description: 'Status [unknown_status] is unknown'});
				expect(state.isBroken).not.toBeDefined();
			});
		});

		it('should set isRunning', function () {
			buildListJson = buildListRunningJson;

			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(true);
			});
		});

		it('should not set isRunning if it is not', function () {
			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(false);
			});
		});

		it('should set changes ignoring new line', function () {
			build.update().subscribe(function (state) {
				expect(state.changes).toEqual([
					{ name: 'dkavanagh', message : 'use seconds in request timestamp' },
					{ name: 'dkavanagh', message: 'use seconds in request timestamp' }
				]);
			});
		});

		it('should set empty changes', function () {
			buildJson.changes.count = 0;

			build.update().subscribe(function (state) {
				expect(state.changes).toEqual([]);
			});
		});

	});
});
