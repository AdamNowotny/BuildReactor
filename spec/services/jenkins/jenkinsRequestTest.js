define([
	'services/jenkins/jenkinsRequest',
	'main/ajaxRequest',
	'signals',
	'text!spec/fixtures/jenkins/views.json'
], function (request, AjaxRequest, signals, viewsJson) {

	'use strict';

	describe('services/cctray/ccRequest', function () {

		var settings;

		beforeEach(function () {
			settings = {
				url: 'http://example.com/',
				username: 'username1',
				password: 'password1'
			};
		});
		
		describe('projects', function () {

			it('should fail if url empty', function () {
				settings.url = '';

				expect(function () {
					request.projects(settings);
				}).toThrow();
			});

			it('should pass credentials to remote service', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.username).toBe(settings.username);
					expect(this.settings.password).toBe(settings.password);
				});

				request.projects(settings);

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});
	 
			it('should get projects from correct URL', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.url).toBe('http://example.com/api/json?depth=1');
				});

				request.projects(settings);

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should pass response returned from Ajax call', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					this.on.responseReceived.dispatch(viewsJson);
				});

				var result = request.projects(settings);
				
				result.addOnce(function (result) {
					expect(result.response).toBe(viewsJson);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});
			
		});

		describe('job', function () {

			it('should get job info', function () {
				var jobResponse = {};
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					this.on.responseReceived.dispatch(jobResponse);
				});

				var result = request.job(settings, 'build_id');
				
				result.addOnce(function (result) {
					expect(result.response).toBe(jobResponse);
				});
				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

		});

		describe('lastCompletedBuild', function () {

			it('should get lastCompletedBuild from correct URL', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.url).toBe('http://example.com/job/build_id/lastCompletedBuild/api/json');
				});

				request.lastCompletedBuild(settings, 'build_id');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should pass response returned from Ajax call', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					this.on.responseReceived.dispatch(viewsJson);
				});

				var result = request.lastCompletedBuild(settings, 'build_id');
				
				result.addOnce(function (result) {
					expect(result.response).toBe(viewsJson);
				});

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

		});

	});
});