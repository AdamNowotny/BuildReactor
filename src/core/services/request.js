define([
	'rx',
	'jquery',
	'mout/queryString/encode',
	'rx.async'
], function (Rx, $, encode) {

	'use strict';

	var httpStatusUnauthorized = 401;
	var httpStatusNotFound = 404;
	var httpStatusOk = 200;

	function send(options, dataType) {
		var timeout = options.timeout || 30000;
		var scheduler = options.scheduler || Rx.Scheduler.timeout;
		var ajaxOptions = createAjaxOptions(options, dataType);
		var promise = $.ajax(ajaxOptions).promise();
		return Rx.Observable.fromPromise(promise)
			.catchException(function (ex) {
				return Rx.Observable.throwException(createAjaxError(ex, ajaxOptions));
			})
			.timeout(timeout, Rx.Observable.throwException(createTimeoutError(timeout, ajaxOptions)), scheduler)
			.selectMany(createParser(options.parser, ajaxOptions));
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

	function createAjaxError(error, ajaxOptions) {
		var response = {
			name: 'AjaxError',
			message: error.statusText,
			httpStatus: error.status,
			url: ajaxOptions.url + encode(ajaxOptions.data),
			ajaxOptions: ajaxOptions
		};
		if (response.httpStatus === httpStatusUnauthorized) {
			response.name = 'UnauthorisedError';
		}
		if (response.httpStatus === httpStatusNotFound) {
			response.name = 'NotFoundError';
		}
		if (error.status === httpStatusOk) {
			response.name = 'ParseError';
			response.message = 'Parsing ' + ajaxOptions.dataType + ' failed';
		}
		return response;
	}

	function createTimeoutError(timeout, ajaxOptions) {
		return {
			name: 'TimeoutError',
			message: 'Connection timed out after ' + timeout / 1000 + ' seconds',
			httpStatus: null,
			ajaxOptions: ajaxOptions,
			url: ajaxOptions.url + encode(ajaxOptions.data)
		};
	}

	function createParser(parser, ajaxOptions) {
		return function (response) {
			try {
				if (parser) {
					return Rx.Observable.returnValue(parser(response));
				} else {
					return Rx.Observable.returnValue(response);
				}
			} catch (ex) {
				return Rx.Observable.throwException(createParseError(ex, ajaxOptions));
			}
		};
	}

	function createParseError(ex, ajaxOptions) {
		var url = ajaxOptions.url + encode(ajaxOptions.data);
		return {
			name: 'ParseError',
			message: ex.message,
			httpStatus: httpStatusOk,
			url: url,
			ajaxOptions: ajaxOptions
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
