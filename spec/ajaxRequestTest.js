define([
		'ajaxRequest',
		'jquery',
		'jasmineSignals'
	], function (AjaxRequest, $, jasmineSignals) {
		describe('AjaxRequest', function () {
			var request;
			var options;
			var mockAjax;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			
			beforeEach(function () {
				mockAjax = spyOn($, 'ajax');
				options = { url: 'http://example.com' };
				request = new AjaxRequest(options);
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
				var responseReceivedSpy = spyOnSignal(request.responseReceived);

				request.send();

				expect(responseReceivedSpy).toHaveBeenDispatched(1);
			});

		    describe('authType', function() {

		        it('should set authType to basic if username specified', function() {
		            var requestOptions = {
		                url: 'http://example.com',
		                username: 'username1',
		                password: 'password123'
		            };
		            mockAjax.andCallFake(function(ajaxOptions) {
		                expect(ajaxOptions.username).toBe(requestOptions.username);
		                expect(ajaxOptions.password).toBe(requestOptions.password);
		                expect(ajaxOptions.data).toBeDefined();
		                expect(ajaxOptions.data.os_authType).toBe('basic');
		            });

		            request = new AjaxRequest(requestOptions);
		            request.send();

		            expect(mockAjax).toHaveBeenCalled();
		        });

		        it('should not set authType if username not specified', function() {
		            var requestOptions = { url: 'http://example.com' };
		            mockAjax.andCallFake(function(ajaxOptions) {
		                expect(ajaxOptions.username).not.toBeDefined();
		                expect(ajaxOptions.password).not.toBeDefined();
		                expect(ajaxOptions.data).not.toBeDefined();
		            });

		            request = new AjaxRequest(requestOptions);
		            request.send();

		            expect(mockAjax).toHaveBeenCalled();
		        });

		        it('should not set authType if username is empty', function() {
		            var requestOptions = {
		                url: 'http://example.com',
		                username: '    ',
		                password: ''
		            };
		            mockAjax.andCallFake(function(ajaxOptions) {
		                expect(ajaxOptions.username).not.toBeDefined();
		                expect(ajaxOptions.password).not.toBeDefined();
		                expect(ajaxOptions.data).not.toBeDefined();
		            });

		            request = new AjaxRequest(requestOptions);
		            request.send();

		            expect(mockAjax).toHaveBeenCalled();
		        });
		    });

			it('should set dataType if specified', function () {
			    var requestOptions = {
			        url: 'http://example.com',
			        dataType: 'xml'
			    };
			    mockAjax.andCallFake(function (ajaxOptions) {
			        expect(ajaxOptions.dataType).toBe(requestOptions.dataType);
			    });

			    request = new AjaxRequest(requestOptions);
			    request.send();

			    expect(mockAjax).toHaveBeenCalled();
			});

			it('should set RequestHeader if specified', function () {
			    var requestOptions = {
			        url: 'http://example.com',
			        dataType: 'xml'
			    };
			    mockAjax.andCallFake(function (ajaxOptions) {
			        var map = { };
			        var beforeSendRequest = {
			            setRequestHeader: function (key, value) {
			                map[key] = value;
			            }
			        };
			        ajaxOptions.beforeSend(beforeSendRequest);
			        expect(map.Accept).toBe('application/xml');
			    });

			    request = new AjaxRequest(requestOptions);
			    request.send();

			    expect(mockAjax).toHaveBeenCalled();
			});

			it('should set json dataType as default', function () {
			    var requestOptions = {
			        url: 'http://example.com'
			    };
			    mockAjax.andCallFake(function (ajaxOptions) {
			        expect(ajaxOptions.dataType).toBe('json');
			    });

			    request = new AjaxRequest(requestOptions);
			    request.send();

			    expect(mockAjax).toHaveBeenCalled();
			});

			it('should set RequestHeader to json by default', function () {
			    var requestOptions = {
			        url: 'http://example.com'
			    };
			    mockAjax.andCallFake(function (ajaxOptions) {
			        var map = {};
			        var beforeSendRequest = {
			            setRequestHeader: function (key, value) {
			                map[key] = value;
			            }
			        };
			        ajaxOptions.beforeSend(beforeSendRequest);
			        expect(map.Accept).toBe('application/json');
			    });

			    request = new AjaxRequest(requestOptions);
			    request.send();

			    expect(mockAjax).toHaveBeenCalled();
			});

			describe('error handling', function () {

				it('should signal on failure', function () {
					mockAjax.andCallFake(function (onErrorOptions) {
						onErrorOptions.error(null, null, null);
					});
					var errorReceivedSpy = spyOnSignal(request.errorReceived);

					request.send();

					expect(errorReceivedSpy).toHaveBeenDispatched(1);
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