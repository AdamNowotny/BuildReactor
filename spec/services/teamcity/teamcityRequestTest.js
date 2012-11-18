define([
	'services/teamcity/teamcityRequest',
	'main/ajaxRequest',
	'json!fixtures/teamcity/buildTypes.json',
	'json!fixtures/teamcity/build.json'
], function (request, AjaxRequest, buildTypesJson, buildJson) {
	'use strict';

	describe('services/teamcity/teamcityRequest', function () {

		var settings;

		beforeEach(function () {
			settings = {
				url: 'http://example.com'
			};
		});

		describe('buildTypes', function () {

			it('should modify url for guest user', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.username).not.toBeDefined();
					expect(this.settings.password).not.toBeDefined();
					expect(this.settings.url).toBe('http://example.com/guestAuth/app/rest/buildTypes');
				});

				request.buildTypes(settings);

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should send modify url if username and password specified', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.username).toBe('USERNAME');
					expect(this.settings.password).toBe('PASSWORD');
					expect(this.settings.url).toBe('http://example.com/httpAuth/app/rest/buildTypes');
				});

				request.buildTypes(settings);

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request completed', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					this.on.responseReceived.dispatch(buildTypesJson);
				});

				request.buildTypes(settings).addOnce(function (result) {
					expect(result.response).toBe(buildTypesJson);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request failed', function () {
				var errorInfo = { name: 'ajax error' };
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					this.on.errorReceived.dispatch(errorInfo);
				});

				request.buildTypes(settings).addOnce(function (result) {
					expect(result.error).toBe(errorInfo);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

		});

		describe('build', function () {

			it('should modify url for guest user', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.username).not.toBeDefined();
					expect(this.settings.password).not.toBeDefined();
					expect(this.settings.url).toBe('http://example.com/guestAuth/app/rest/buildTypes/id:bt297/builds/lookupLimit:1');
				});

				request.build(settings, 'bt297');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should send modify url if username and password specified', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.username).toBe('USERNAME');
					expect(this.settings.password).toBe('PASSWORD');
					expect(this.settings.url).toBe('http://example.com/httpAuth/app/rest/buildTypes/id:bt297/builds/lookupLimit:1');
				});

				request.build(settings, 'bt297');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request completed', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					this.on.responseReceived.dispatch(buildJson);
				});

				request.build(settings, 'bt297').addOnce(function (result) {
					expect(result.response).toBe(buildJson);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request failed', function () {
				var errorInfo = { name: 'ajax error' };
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					this.on.errorReceived.dispatch(errorInfo);
				});

				request.build(settings, 'bt297').addOnce(function (result) {
					expect(result.error).toBe(errorInfo);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

		});

	});
});