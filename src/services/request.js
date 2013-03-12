define([
	'rx',
	'jquery',
	'rx.jquery'
], function (Rx, $) {

	'use strict';

	function createAjaxError(error, ajaxOptions) {
		var message;
		if (error.ajaxStatus === 'parsererror') {
			message = 'Unrecognized response';
		} else {
			message = (error.ajaxError) ? error.ajaxError : 'Ajax connection error';
		}
		return {
			name: 'AjaxError',
			httpStatus: (error.jqXhr) ? error.jqXhr.status : null,
			ajaxStatus: error.ajaxStatus,
			message: message,
			ajaxOptions: ajaxOptions
		};
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