define([
	'services/request',
	'rx',
	'jquery'
], function (request, Rx, $) {

	'use strict';

	describe('services/request', function () {

		describe('json', function () {

			it('should set dataType to json', function () {
				spyOn($, 'ajaxAsObservable').andCallFake(function (options) {
					expect(options.dataType).toBe('json');
					return Rx.Observable.returnValue({ data: {}, textStatus: 'success' });
				});

				request.json({ url: 'http://sample.com'}).subscribe();

				expect($.ajaxAsObservable).toHaveBeenCalled();
			});


			it('should return json response', function () {
				var response = { data: {}, textStatus: 'success' };
				var actualResponse;
				spyOn($, 'ajaxAsObservable').andReturn(Rx.Observable.returnValue(response));

				request.json({ url: 'http://sample.com'}).subscribe(function (d) {
					actualResponse = d;
				});

				expect(actualResponse).toBe(response);
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
					expect(actualResponse.ajaxOptions).toBe(ajaxOptions);
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
					expect(actualResponse.ajaxOptions).toBe(ajaxOptions);
				});

				it('should throw exception on parse error', function () {
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
					expect(actualResponse.ajaxOptions).toBe(ajaxOptions);
				});
			});
		});

	});

});