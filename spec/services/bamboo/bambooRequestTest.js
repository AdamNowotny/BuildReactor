define([
	'services/bamboo/bambooRequest',
	'main/ajaxRequest'
],
	function (BambooRequest, AjaxRequest) {

		'use strict';
		
		describe('services/bamboo/BambooRequest', function () {

			var request;
			var settings;

			beforeEach(function () {
				settings = {
					url: 'http://example.com/',
					username: 'username1',
					password: 'password1'
				};
				request = new BambooRequest(settings);
			});

			it('should pass credentials to remote service', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.username).toBe(settings.username);
					expect(this.settings.password).toBe(settings.password);
				});

				request.send('path/to/append');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			describe('credentials', function () {

				it('should pass os_authType parameter to remote service', function () {
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						expect(this.settings.data.os_authType).toBe('basic');
					});

					request.send('path');

					expect(AjaxRequest.prototype.send).toHaveBeenCalled();
				});


				it('should not set authType if username not specified', function () {
					var settings = { url: 'http://example.com' };
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						expect(this.settings.data).not.toBeDefined();
					});

					var request = new BambooRequest(settings);
					request.send('path');

					expect(AjaxRequest.prototype.send).toHaveBeenCalled();
				});

				it('should not set authType if username is empty', function () {
					var settings = {
						url: 'http://example.com',
						username: '    ',
						password: ''
					};
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						expect(this.settings.username).not.toBeDefined();
						expect(this.settings.password).not.toBeDefined();
						expect(this.settings.data).not.toBeDefined();
					});

					var request = new BambooRequest(settings);
					request.send('path');

					expect(AjaxRequest.prototype.send).toHaveBeenCalled();
				});

			});

			it('should fail if url empty', function () {
				var settings = { url: '' };

				expect(function () {
					var request = new BambooRequest(settings);
				}).toThrow();
			});

			it('should correct url', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.url).toBe('http://example.com/rest/api/latest/path');
				});
				request = new BambooRequest({ url: 'http://example.com' });

				request.send('path');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should get projects', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.url).toBe('http://example.com/rest/api/latest/project?expand=projects.project.plans.plan');
				});

				request.projects();

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should get latest plan results', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.url).toBe('http://example.com/rest/api/latest/result/SOME-PLAN-KEY/latest?expand=changes');
				});

				request.latestPlanResult('SOME-PLAN-KEY');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

			it('should get plan details', function () {
				spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
					expect(this.settings.url).toBe('http://example.com/rest/api/latest/plan/SOME-PLAN-KEY');
				});

				request.plan('SOME-PLAN-KEY');

				expect(AjaxRequest.prototype.send).toHaveBeenCalled();
			});

		});
	});