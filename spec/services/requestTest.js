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
				var response = {};
				spyOn($, 'ajaxAsObservable').andReturn(Rx.Observable.returnValue({ data: response, textStatus: 'success' }));

				request.json({ url: 'http://sample.com'}).subscribe(function (d) {
					expect(d.data).toBe(response);
				});
			});
		});

	});

});