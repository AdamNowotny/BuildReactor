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

	settingsFormView.show = function (d) {
		settingsFormView.on.clickedShow.removeAll();
		settingsFormView.on.changed.removeAll();
		container.html(template(d));
		$('.settings-form', container).submit(function () {
			return false;
		});
		$('.url-input', container).keyup(urlChanged).change(urlChanged);
		$('.show-button', container).click(showClicked);
		$('.save-button', container).click(saveClicked);
		$('.url-input', container).focus();
		urlChanged();
		container.show();
	};

	settingsFormView.hide = function () {
		container.hide().html('');
	};

	settingsFormView.resetButtons = function () {
		$('.show-button', container).removeAttr('disabled');
		$('.show-button i', container).removeClass('animate');
		$('.save-button', container).removeAttr('disabled');
	};

	function showClicked() {
		if ($('.show-button', container).attr('disabled')) {
			return;
		}
		$('.show-button', container).attr('disabled', 'disabled');
		$('.show-button i', container).addClass('animate');
		settingsFormView.on.clickedShow.dispatch(getCurrentValues());
	}

	function saveClicked() {
		settingsFormView.on.changed.dispatch(getCurrentValues());
	}

	function urlChanged() {
		var url = $('.url-input', container).val();
		if (url) {
			$('.show-button', container).removeAttr('disabled');
		} else {
			$('.show-button', container).attr('disabled', 'disabled');
		}
	}

	function getCurrentValues() {
		return {
			url: $('.url-input', container).val(),
			username: $('.username-input', container).val(),
			password: $('.password-input', container).val(),
			updateInterval: parseInt($('.update-interval-input', container).val(), 10),
		};
	}

	return settingsFormView;
});