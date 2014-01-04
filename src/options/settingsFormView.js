define([
	'hbs!templates/settingsForm',
	'jquery',
	'signals'
], function (template, $, signals) {

	'use strict';

	var container;

	function settingsFormView(selector) {
		container = $(selector);
		return settingsFormView;
	}

	settingsFormView.on = {
		clickedShow: new signals.Signal(),
		changed: new signals.Signal()
	};

	settingsFormView.show = function (serviceInfo) {
		settingsFormView.on.clickedShow.removeAll();
		settingsFormView.on.changed.removeAll();
		container.html(template(serviceInfo));
		$('.settings-form', container).submit(function () {
			return false;
		});
		$('.show-button', container).click(showClicked);
		$('.save-button', container).click(saveClicked);
		container.show();
		$('input:first', container).focus();
	};

	settingsFormView.hide = function () {
		container.hide().html('');
	};

	settingsFormView.resetButtons = function () {
		$('.show-button', container).removeAttr('disabled');
		$('.show-button i', container).removeClass('fa-spin');
		$('.save-button', container).removeAttr('disabled');
	};

	function showClicked() {
		if ($('.show-button', container).attr('disabled')) {
			return;
		}
		$('.show-button', container).attr('disabled', 'disabled');
		$('.show-button i', container).addClass('fa-spin');
		settingsFormView.on.clickedShow.dispatch(getCurrentValues());
	}

	function saveClicked() {
		settingsFormView.on.changed.dispatch(getCurrentValues());
	}

	function getCurrentValues() {
		var values = {};
		$('.field').each(function (i, d) {
			var name = $(d).data('name');
			var input = $('input', d)[0];
			if (input.type === 'number') {
				values[name] = parseInt(input.value, 10);
			} else {
				values[name] = input.value;
			}
		});
		return values;
	}

	return settingsFormView;
});