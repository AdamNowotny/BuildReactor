define([
	'src/bamboo/bambooRequest',
	'src/ajaxRequest',
	'SignalLogger'
	],
	function (BambooRequest, AjaxRequest, SignalLogger) {

	    describe('BambooRequest', function () {

	        var request;
	        var logger;
	        var settings;

	        beforeEach(function () {
	            settings = {
	                url: 'http://example.com/',
	                username: 'username1',
	                password: 'password1'
	            };
	            request = new BambooRequest(settings);
	            logger = new SignalLogger({
	                responseReceived: request.responseReceived,
	                errorReceived: request.errorReceived
	            });
	        });

	        it('should pass credentials to remote service', function () {
	            spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
	                expect(this.settings.username).toBe(settings.username);
	                expect(this.settings.password).toBe(settings.password);
	            });

	            request.send('path/to/append');

	            expect(AjaxRequest.prototype.send).toHaveBeenCalled();
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

	        it('should get plan information', function () {
	            spyOn(AjaxRequest.prototype, 'send').andCallFake(function () {
	                expect(this.settings.url).toBe('http://example.com/rest/api/latest/result/SOME-PLAN-KEY/latest?expand=jiraIssues,changes.change');
	            });

	            request.latestPlanResult('SOME-PLAN-KEY');

	            expect(AjaxRequest.prototype.send).toHaveBeenCalled();
	        });

	    });
	});