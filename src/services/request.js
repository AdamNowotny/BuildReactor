define([
	'rx',
	'jquery',
	'mout/queryString/encode',
	'rx.jquery'
], function (Rx, $, encode) {

	'use strict';

	var unauthorizedStatusCode = 401;

	function createAjaxError(error, ajaxOptions) {
		var response = {};
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
		if (httpStatus && httpStatus !== 200) {
			response.description = response.message + ' (' + httpStatus + ')';
		}
		response.details = {
			ajaxOptions: ajaxOptions,
			url: ajaxOptions.url + encode(ajaxOptions.data),
			httpStatus: httpStatus
		};
		return response;
	}

	function createAjaxOptions(options, dataType) {
		return {
			type: 'GET',
			url: options.url,
			data: options.data,
			cache: false,
			dataType: dataType
		};
	}

	function createParser(parser) {
		return function (response) {
			try {
				if (parser) {
					return parser(response.data);
				} else {
					return response.data;
				}
			} catch (ex) {
				throw { name: 'ParseError', message: 'Unrecognized response', httpResponse: response};
			}
		};
	}

	function send(options, dataType) {
		var ajaxOptions = createAjaxOptions(options, dataType);
		if (options.username && options.username.trim() !== '') {
			var credentials = options.username + ':' + options.password;
			var base64 = btoa(credentials);
			ajaxOptions.headers = { 'Authorization': 'Basic ' + base64 };
		}
		return $.ajaxAsObservable(ajaxOptions).catchException(function (ex) {
			var ajaxError = createAjaxError(ex, ajaxOptions);
			if (options.authCookie && ajaxError.details.httpStatus === unauthorizedStatusCode) {
				chrome.cookies.remove({ url: options.url, name: options.authCookie });
			}
			throw ajaxError;
		}).retry(2).select(createParser(options.parser));
	}

	function json(options) {
		return send(options, 'json');
	}

	function xml(options) {
		return send(options, 'xml');
	}

	return {
		json: json,
		xml: xml
	};
});