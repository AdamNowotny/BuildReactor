define([
	'core/services/request',
	'rx',
	'jquery',
	'rx.testing'
], function (request, Rx, $) {

	'use strict';

	var successResponse = { data: {}, textStatus: 'success' };
	var onNext = Rx.ReactiveTest.onNext;
	var onError = Rx.ReactiveTest.onError;
	var successDeferred;

	function createSuccessDeferred(result) {
		var d = $.Deferred();
		d.resolve(result);
		return d;
	}

	function createFailureDeferred(result) {
		var d = $.Deferred();
		d.reject(result);
		return d;
	}

	describe('core/services/request', function () {

		beforeEach(function () {
			successDeferred = createSuccessDeferred(successResponse);
		});

		describe('json', function () {

			it('should set ajax options', function () {
				var settings = {
					url: 'http://sample.com',
					data: { param: 'value' }
				};
				spyOn($, 'ajax').andCallFake(function (options) {
					expect(options.dataType).toBe('json');
					expect(options.url).toBe('http://sample.com');
					expect(options.type).toBe('GET');
					expect(options.cache).toBe(false);
					expect(options.data).toBe(settings.data);
					return successDeferred;
				});

				request.json(settings).subscribe();

				expect($.ajax).toHaveBeenCalled();
			});

			it('should encode url', function () {
				var settings = {
					url: 'http://sample.com/white space/and[brackets]'
				};
				spyOn($, 'ajax').andCallFake(function (options) {
					expect(options.url).toBe('http://sample.com/white%20space/and%5Bbrackets%5D');
					return successDeferred;
				});

				request.json(settings).subscribe();

				expect($.ajax).toHaveBeenCalled();
			});

			it('should set basic authentication', function () {
				spyOn($, 'ajax').andCallFake(function (options) {
					expect(options.headers.Authorization).toBe('Basic dXNlcm5hbWUxOnBhc3N3b3JkMTIz');
					return successDeferred;
				});
				var settings = {
					url: 'http://example.com',
					username: 'username1',
					password: 'password123'
				};

				request.json(settings).subscribe();

				expect($.ajax).toHaveBeenCalled();
			});

			it('should call custom parser if specified', function () {
				var parser = jasmine.createSpy();
				spyOn($, 'ajax').andReturn(successDeferred);
				var settings = {
					url: 'http://example.com',
					parser: parser
				};

				request.json(settings).subscribe();

				expect(parser).toHaveBeenCalledWith(successResponse);
			});

			it('should return json response', function () {
				var response = { data: "some data", textStatus: 'success' };
				var actualResponse;
				spyOn($, 'ajax').andReturn(createSuccessDeferred(response));

				request.json({ url: 'http://sample.com'}).subscribe(function (d) {
					actualResponse = d;
				});

				expect(actualResponse).toBe(response);
			});

			describe('errors', function () {

				it('should throw exception on unknown connection error', function () {
					var response = {
						statusText: 'error',
						status: 500
					};
					var ajaxOptions = {
						url: 'http://sample.com/',
						data: {
							param1: 'value1',
							'param_2': 'value2'
						}
					};
					spyOn($, 'ajax').andReturn(createFailureDeferred(response));

					var actualError;
					request.json(ajaxOptions).subscribe(function (d) {}, function (d) {
						actualError = d;
					});

					expect(actualError).toEqual({
						name: 'AjaxError',
						httpStatus: 500,
						message: 'error',
						url: 'http://sample.com/?param1=value1&param_2=value2',
						ajaxOptions: {
							type: 'GET',
							url: 'http://sample.com/',
							data: {
								param1: 'value1',
								'param_2': 'value2'
							},
							cache: false,
							dataType: 'json'
						}
					});
				});

				it('should throw exception on timeout', function () {
					var scheduler = new Rx.TestScheduler();
					var ajaxOptions = { url: 'http://sample.com/', scheduler: scheduler, timeout: 20000 };
					spyOn($, 'ajax').andReturn($.Deferred());

					var result = scheduler.startWithTiming(function () {
						return request.json(ajaxOptions);
					}, 100, 200, 21000);

					expect(result.messages[0].time).toBe(20200);
					var actualError = result.messages[0].value.exception;

					expect(actualError).toEqual({
						name: 'TimeoutError',
						httpStatus: null,
						message: 'Connection timed out after 20 seconds',
						url: 'http://sample.com/',
						ajaxOptions: {
							type: 'GET',
							url: 'http://sample.com/',
							cache: false,
							dataType: 'json'
						}
					});
				});

				it('should throw exception on connection error with message', function () {
					var response = {
						status: 404,
						statusText: 'Not found'
					};
					var actualError;
					var ajaxOptions = { url: 'http://sample.com/' };
					spyOn($, 'ajax').andReturn(createFailureDeferred(response));

					request.json(ajaxOptions).subscribe(function (d) {}, function (d) {
						actualError = d;
					});

					expect(actualError).toEqual({
						name: 'NotFoundError',
						message: 'Not found',
						httpStatus: 404,
						url: 'http://sample.com/',
						ajaxOptions: {
							type: 'GET',
							url: 'http://sample.com/',
							cache: false,
							dataType: 'json'
						}
					});
				});

				it('should throw UnauthorisedError on 401', function () {
					var response = {
						status: 401,
						statusText: 'Unauthorized'
					};
					var ajaxOptions = { url: 'http://sample.com/' };
					spyOn($, 'ajax').andReturn(createFailureDeferred(response));

					var actualError;
					request.json(ajaxOptions).subscribe(function (d) {}, function (d) {
						actualError = d;
					});

					expect(actualError).toEqual({
						name: 'UnauthorisedError',
						message: 'Unauthorized',
						httpStatus: 401,
						url: 'http://sample.com/',
						ajaxOptions: {
							type: 'GET',
							url: 'http://sample.com/',
							cache: false,
							dataType: 'json'
						}
					});
				});

				it('should throw exception on jQuery parse error', function () {
					var response = {
						statusText: 'OK',
						status: 200
					};
					var ajaxOptions = { url: 'http://sample.com/' };
					spyOn($, 'ajax').andReturn(createFailureDeferred(response));

					var actualError;
					request.json(ajaxOptions).subscribe(function (d) {}, function (d) {
						actualError = d;
					});

					expect(actualError).toEqual({
						name: 'ParseError',
						message: 'Parsing json failed',
						httpStatus: 200,
						url: 'http://sample.com/',
						ajaxOptions: {
							type: 'GET',
							url: 'http://sample.com/',
							cache: false,
							dataType: 'json'
						}
					});
				});

				it('should throw exception on custom parse error', function () {
					var response = {
						statusText: 'OK',
						status: 200
					};
					spyOn($, 'ajax').andReturn(createSuccessDeferred(response));
					var ajaxOptions = {
						url: 'http://example.com',
						parser: function (response) {
							return response.unknown.unknown;
						}
					};

					var actualError;
					request.json(ajaxOptions).subscribe(function (d) {}, function (ex) {
						actualError = ex;
					});

					expect(actualError).toEqual({
						name: 'ParseError',
						message: "'undefined' is not an object (evaluating 'response.unknown.unknown')",
						httpStatus: 200,
						url: 'http://example.com',
						ajaxOptions: {
							type: 'GET',
							url: 'http://example.com',
							data: undefined,
							cache: false,
							dataType: 'json'
						}
					});
				});

			});
		});

		describe('xml', function () {

			it('should set ajax options', function () {
				var ajaxOptions = {
					url: 'http://sample.com',
					data: { param: 'value' }
				};
				spyOn($, 'ajax').andCallFake(function (options) {
					expect(options.dataType).toBe('xml');
					expect(options.url).toBe('http://sample.com');
					expect(options.type).toBe('GET');
					expect(options.cache).toBe(false);
					expect(options.data).toBe(ajaxOptions.data);
					return successDeferred;
				});

				request.xml(ajaxOptions).subscribe();

				expect($.ajax).toHaveBeenCalled();
			});

		});
	});

});
