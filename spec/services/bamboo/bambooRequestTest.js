define([
	'services/bamboo/bambooRequest',
	'main/ajaxRequest',
	'signals',
	'jasmineSignals'
],
	function (BambooRequest, AjaxRequest, Signal, spyOnSignal) {

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
				spyOnSignal(request.on.errorReceived);
			});

			describe('credentials', function () {

				it('should pass credentials to remote service', function () {
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						expect(this.settings.username).toBe(settings.username);
						expect(this.settings.password).toBe(settings.password);
					});

					request.send('path/to/append');

					expect(AjaxRequest.prototype.send).toHaveBeenCalled();
				});

				it('should not pass credentials if username is empty', function () {
					var settings = {
						url: 'http://example.com',
						username: '    ',
						password: 'any password'
					};
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						expect(this.settings.username).not.toBeDefined();
						expect(this.settings.password).not.toBeDefined();
					});

					var request = new BambooRequest(settings);
					request.send('path');

					expect(AjaxRequest.prototype.send).toHaveBeenCalled();
				});

				it('should remove session cookie if 401 received', function () {
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						this.on.errorReceived.dispatch({ httpStatus: 401 });
					});
					spyOn(chrome.cookies, 'remove').andCallFake(function (info) {
						expect(info.url).toBe('http://example.com/rest/api/latest/path');
						expect(info.name).toBe('JSESSIONID');
					});

					request.send('path');

					expect(chrome.cookies.remove).toHaveBeenCalled();
				});

				it('should retry once if 401 received', function () {
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						this.on.errorReceived.dispatch({ httpStatus: 401 });
					});

					request.send('path');

					expect(AjaxRequest.prototype.send.callCount).toBe(2);
				});

				it('should signal error only after retry if 401 received', function () {
					var callCount = 0;
					spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
						callCount++;
						this.on.errorReceived.dispatch({ httpStatus: 401 });
					});

					request.send('path');

					expect(callCount).toBe(2);
					expect(request.on.errorReceived).toHaveBeenDispatched(1);
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