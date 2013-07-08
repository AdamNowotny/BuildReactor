define([
	'rx',
	'jquery',
	'mout/queryString/encode',
	'rx.jquery'
], function (Rx, $, encode) {

	'use strict';

	var unauthorizedStatusCode = 401;

	function send(options, dataType) {
		var timeout = options.timeout || 30000;
		var scheduler = options.scheduler || Rx.Scheduler.timeout;
		var ajaxOptions = createAjaxOptions(options, dataType);
		return $.ajaxAsObservable(ajaxOptions)
			.catchException(function (ex) {
				var ajaxError = createAjaxError(ex, ajaxOptions);
				if (options.authCookie && ajaxError.httpStatus === unauthorizedStatusCode) {
					chrome.cookies.remove({ url: options.url, name: options.authCookie });
				}
				return Rx.Observable.throwException(ajaxError);
			}).retry(2)
			.timeout(timeout, Rx.Observable.throwException(createTimeoutError(timeout, ajaxOptions)), scheduler)
			.select(createParser(options.parser, ajaxOptions));
	}

	function createTimeoutError(timeout, ajaxOptions) {
		return {
			name: 'TimeoutError',
			message: 'Timeout',
			description: 'Connection timed out after ' + timeout / 1000 + ' seconds',
			ajaxOptions: ajaxOptions,
			url: ajaxOptions.url + encode(ajaxOptions.data)
		};
	}
	
	function createParseError(ajaxOptions) {
		var url = ajaxOptions.url + encode(ajaxOptions.data);
		return {
			name: 'ParseError',
			message: 'Unrecognized response',
			description: 'Unrecognized response received from [' + url + ']',
			ajaxOptions: ajaxOptions,
			url: url
		};
	}

	function createAjaxError(error, ajaxOptions) {
		var response = {
			ajaxOptions: ajaxOptions,
			url: ajaxOptions.url + encode(ajaxOptions.data)
		};
		if (error.textStatus === 'parsererror') {
			response.name = 'ParseError';
			response.message = (error.errorThrown && error.errorThrown.message) ?
				error.errorThrown.message :
				'Unrecognized response';
		} else {
			response.name = 'AjaxError';
			response.message = (error.errorThrown) ? error.errorThrown : 'Ajax connection error';
		}
		var httpStatus = (error.jqXHR && error.jqXHR.status > 0) ? error.jqXHR.status : null;
		response.httpStatus = httpStatus;
		if (httpStatus && httpStatus !== 200) {
			response.description = response.message + ' (' + httpStatus + ')';
		}
		return response;
	}

	function createAjaxOptions(options, dataType) {
		var ajaxOptions = {
			type: 'GET',
			url: options.url,
			data: options.data,
			cache: false,
			dataType: dataType
		};
		if (options.username && options.username.trim() !== '') {
			var credentials = options.username + ':' + options.password;
			var base64 = btoa(credentials);
			ajaxOptions.headers = { 'Authorization': 'Basic ' + base64 };
		}
		return ajaxOptions;
	}

	function createParser(parser, ajaxOptions) {
		return function (response) {
			try {
				if (parser) {
					return parser(response.data);
				} else {
					return response.data;
				}
			} catch (ex) {
				throw createParseError(ajaxOptions);
			}
		};
	}

	return {
		json: function (options) {
			return send(options, 'json');
		},
		xml: function (options) {
			return send(options, 'xml');
		}
	};
});