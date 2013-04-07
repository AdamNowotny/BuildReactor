define([
	'services/jenkins/jenkinsRequest',
	'main/ajaxRequest',
	'text!spec/fixtures/jenkins/views.json'
], function (request, AjaxRequest, viewsJson) {

	'use strict';

	describe('services/jenkins/jenkinsRequest', function () {

		var settings;

		beforeEach(function () {
			settings = {
				url: 'http://example.com/',
				username: 'username1',
				password: 'password1'
			};
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