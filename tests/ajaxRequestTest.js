define([
		'src/ajaxRequest',
		'jquery',
		'SignalLogger'
	], function (AjaxRequest, $, SignalLogger) {
	describe('AjaxRequest', function () {
		var request;
		var options;
		var logger;
		var mockAjax;

		beforeEach(function () {
			mockAjax = spyOn($, 'ajax');
			options = { url: 'http://example.com' };
			request = new AjaxRequest(options);
			logger = new SignalLogger({
				responseReceived: request.responseReceived,
				errorReceived: request.errorReceived
			});
		});

		it('should use jQuery to send Ajax request', function () {
			request.send();

			expect($.ajax).toHaveBeenCalled();
		});

		it('should signal when response received', function () {
			var result = {};
			mockAjax.andCallFake(function (onSuccessOptions) {
				onSuccessOptions.success(result, null, null);
			});

			request.send();

			expect(logger.responseReceived.count).toBe(1);
		});

		describe('error handling', function () {

			it('should signal on failure', function () {
				mockAjax.andCallFake(function (onErrorOptions) {
					onErrorOptions.error(null, null, null);
				});

				request.send();

				expect(logger.errorReceived.count).toBe(1);
			});

			it('should fail if url not present', function () {
				expect(function () { new AjaxRequest({ url: null }); }).toThrow();
			});

			it('should fail if success callback not present', function () {
				expect(function () { new AjaxRequest({ success: undefined }); }).toThrow();
			});

			it('should fail if error callback not present', function () {
				expect(function () { new AjaxRequest({ error: undefined }); }).toThrow();
			});

		});
	});
});