define([
	'rx',
	'jquery',
	'mout/queryString/encode',
	'rx.jquery'
], function (Rx, $, encode) {

	'use strict';

	function createAjaxError(error, ajaxOptions) {
		var response = {};
		var message;
		if (error.textStatus === 'parsererror') {
			response.name = 'ParseError';
			response.message = (error.errorThrown && error.errorThrown.message) ?
				error.errorThrown.message :
				'Unrecognized response';
		} else {
			response.name = 'AjaxError';
			response.message = (error.errorThrown) ? error.errorThrown : 'Ajax connection error';
		}
		response.httpStatus = (error.jqXHR && error.jqXHR.status > 0) ? error.jqXHR.status : null;
		response.url = ajaxOptions.url + encode(ajaxOptions.data);
		response.ajaxOptions = ajaxOptions;
		return response;
	}

	function json(ajaxOptions) {
		$.extend(ajaxOptions, {
			cache: false,
			dataType: 'json'
		});
		return $.ajaxAsObservable(ajaxOptions).catchException(function (ex) {
			return Rx.Observable.throwException(createAjaxError(ex, ajaxOptions));
		});
	}

	return {
		json: json
	};
});