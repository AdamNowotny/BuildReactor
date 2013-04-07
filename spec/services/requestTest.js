define([
	'services/request',
	'rx',
	'jquery'
], function (request, Rx, $) {

	'use strict';

	var successResponse = { data: {}, textStatus: 'success' };

	describe('services/request', function () {

		describe('json', function () {

			it('should set dataType to json', function () {
				spyOn($, 'ajaxAsObservable').andCallFake(function (options) {
					expect(options.dataType).toBe('json');
					return Rx.Observable.returnValue(successResponse);
				});

				request.json({ url: 'http://sample.com'}).subscribe();

				expect($.ajaxAsObservable).toHaveBeenCalled();
			});

			it('should set url', function () {
				spyOn($, 'ajaxAsObservable').andCallFake(function (options) {
					expect(options.url).toBe('http://sample.com');
					return Rx.Observable.returnValue(successResponse);
				});

				request.json({ url: 'http://sample.com'}).subscribe();

				expect($.ajaxAsObservable).toHaveBeenCalled();
			});

			it('should set query data', function () {
				var data = { key1: 'value1'};
				spyOn($, 'ajaxAsObservable').andCallFake(function (options) {
					expect(options.data).toBe(data);
					return Rx.Observable.returnValue(successResponse);
				});

				request.json({ url: 'http://sample.com', data: data}).subscribe();

				expect($.ajaxAsObservable).toHaveBeenCalled();
			});

			it('should set basic authentication', function () {
			});

			it('should call custom parser if specified', function () {
			});

			it('should return json response', function () {
				var response = { data: "some data", textStatus: 'success' };
				var actualResponse;
				spyOn($, 'ajaxAsObservable').andReturn(Rx.Observable.returnValue(response));

				request.json({ url: 'http://sample.com'}).subscribe(function (d) {
					actualResponse = d;
				});

				expect(actualResponse).toBe(response.data);
			});

			describe('errors', function () {

				it('should throw exception on connection error', function () {
					var response = {
						textStatus: 'error',
						jqXHR: { status: 0 }
					};
					var actualResponse;
					var ajaxOptions = { url: 'http://sample.com' };
					spyOn($, 'ajaxAsObservable').andReturn(Rx.Observable.throwException(response));

					request.json(ajaxOptions).subscribe(null, function (d) {
						actualResponse = d;
					});

					expect(actualResponse.name).toBe('AjaxError');
					expect(actualResponse.message).toBe('Ajax connection error');
					expect(actualResponse.httpStatus).toBe(null);
					expect(actualResponse.url).toBe('http://sample.com');
					expect(actualResponse.ajaxOptions).toBeDefined();
				});

				it('should throw exception with full url', function () {
					var response = { textStatus: 'error' };
					var actualResponse;
					var ajaxOptions = {
						url: 'http://sample.com/',
						data: {
							param1: 'value1',
							'param_2': 'value2'
						}
					};
					spyOn($, 'ajaxAsObservable').andReturn(Rx.Observable.throwException(response));

					request.json(ajaxOptions).subscribe(null, function (d) {
						actualResponse = d;
					});

					expect(actualResponse.url).toBe('http://sample.com/?param1=value1&param_2=value2');
				});

				it('should throw exception on connection error with message', function () {
					var response = {
						errorThrown: 'Not found',
						textStatus: 'error',
						jqXHR: { status: 404 }
					};
					var actualResponse;
					var ajaxOptions = { url: 'http://sample.com' };
					spyOn($, 'ajaxAsObservable').andReturn(Rx.Observable.throwException(response));

					request.json(ajaxOptions).subscribe(null, function (d) {
						actualResponse = d;
					});

					expect(actualResponse.name).toBe('AjaxError');
					expect(actualResponse.message).toBe('Not found');
					expect(actualResponse.httpStatus).toBe(404);
					expect(actualResponse.url).toBe('http://sample.com');
					expect(actualResponse.ajaxOptions).toBeDefined();
				});

				it('should throw exception on jQuery parse error', function () {
					var response = {
						textStatus: 'parsererror',
						jqXHR: {
							status: 200,
							responseText: '<html />'
						},
						errorThrown: {
							message: 'Unexpected token <'
						}
					};
					var actualResponse;
					var ajaxOptions = { url: 'http://sample.com' };
					spyOn($, 'ajaxAsObservable').andReturn(Rx.Observable.throwException(response));

					request.json(ajaxOptions).subscribe(null, function (d) {
						actualResponse = d;
					});

					expect(actualResponse.name).toBe('ParseError');
					expect(actualResponse.message).toBe('Unexpected token <');
					expect(actualResponse.httpStatus).toBe(200);
					expect(actualResponse.url).toBe('http://sample.com');
					expect(actualResponse.ajaxOptions).toBeDefined();
				});

				it('should throw exception on custom parse error', function () {
				});

			});
		});

	});

});