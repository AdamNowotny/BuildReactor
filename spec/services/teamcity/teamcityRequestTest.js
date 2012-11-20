define([
	'services/teamcity/teamcityRequest',
	'main/ajaxRequest',
	'json!fixtures/teamcity/buildTypes.json',
	'json!fixtures/teamcity/build.json'
], function (request, AjaxRequest, buildTypesJson, buildJson) {
	'use strict';

	describe('services/teamcity/teamcityRequest', function () {

		var settings;
		var mockAjaxRequestSend;

		beforeEach(function () {
			settings = {
				url: 'http://example.com'
			};
			mockAjaxRequestSend = spyOn(AjaxRequest.prototype, 'send');
		});

		describe('buildTypes', function () {

			it('should modify url for guest user', function () {
				mockAjaxRequestSend.andCallFake(function () {
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
				mockAjaxRequestSend.andCallFake(function () {
					expect(this.settings.username).toBe('USERNAME');
					expect(this.settings.password).toBe('PASSWORD');
					expect(this.settings.url).toBe('http://example.com/httpAuth/app/rest/buildTypes');
				});

				request.buildTypes(settings);

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request completed', function () {
				mockAjaxRequestSend.andCallFake(function () {
					this.on.responseReceived.dispatch(buildTypesJson);
				});

				request.buildTypes(settings).addOnce(function (result) {
					expect(result.response).toBe(buildTypesJson);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request failed', function () {
				var errorInfo = { name: 'ajax error' };
				mockAjaxRequestSend.andCallFake(function () {
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
				mockAjaxRequestSend.andCallFake(function () {
					expect(this.settings.username).not.toBeDefined();
					expect(this.settings.password).not.toBeDefined();
					expect(this.settings.url).toBe('http://example.com/guestAuth/app/rest/buildTypes/id:bt297/builds/count:1');
				});

				request.build(settings, 'bt297');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should modify url if username and password specified', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				mockAjaxRequestSend.andCallFake(function () {
					expect(this.settings.username).toBe('USERNAME');
					expect(this.settings.password).toBe('PASSWORD');
					expect(this.settings.url).toBe('http://example.com/httpAuth/app/rest/buildTypes/id:bt297/builds/count:1');
				});

				request.build(settings, 'bt297');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request completed', function () {
				mockAjaxRequestSend.andCallFake(function () {
					this.on.responseReceived.dispatch(buildJson);
				});

				request.build(settings, 'bt297').addOnce(function (result) {
					expect(result.response).toBe(buildJson);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request failed', function () {
				var errorInfo = { name: 'ajax error' };
				mockAjaxRequestSend.andCallFake(function () {
					this.on.errorReceived.dispatch(errorInfo);
				});

				request.build(settings, 'bt297').addOnce(function (result) {
					expect(result.error).toBe(errorInfo);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

		});

		describe('buildRunning', function () {

			it('should modify url for guest user', function () {
				mockAjaxRequestSend.andCallFake(function () {
					expect(this.settings.username).not.toBeDefined();
					expect(this.settings.password).not.toBeDefined();
					expect(this.settings.url).toBe('http://example.com/guestAuth/app/rest/buildTypes/id:bt345/builds/running:true');
				});

				request.buildRunning(settings, 'bt345');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should modify url if username and password specified', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				mockAjaxRequestSend.andCallFake(function () {
					expect(this.settings.username).toBe('USERNAME');
					expect(this.settings.password).toBe('PASSWORD');
					expect(this.settings.url).toBe('http://example.com/httpAuth/app/rest/buildTypes/id:bt297/builds/running:true');
				});

				request.buildRunning(settings, 'bt297');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should signal request completed if response received', function () {
				var httpResponse = {};
				mockAjaxRequestSend.andCallFake(function () {
					this.on.responseReceived.dispatch(httpResponse);
				});
				var result;

				request.buildRunning(settings, 'bt297').addOnce(function (response) {
					result = response;
				});

				expect(result.response).toBe(httpResponse);
			});

			it('should signal request completed if error received', function () {
				mockAjaxRequestSend.andCallFake(function () {
					this.on.errorReceived.dispatch({ httpStatus: 404 });
				});
				var result;

				request.buildRunning(settings, 'bt297').addOnce(function (errorInfo) {
					result = errorInfo;
				});

				expect(result.error.httpStatus).toBe(404);
			});

		});

	});
});