require.config({
	baseUrl: 'src',
	paths: {
		mout: '../components/mout/src',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: "../components/jquery/jquery",
		signals: '../components/js-signals/dist/signals',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		rx: '../lib/rx/rx.min',
		rxTime: '../lib/rx/rx.time.min'
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	shim: {
		bootstrap: [ 'jquery' ]
	}
});
require([
	'jquery',
	'popupController',
	'rx',
	'bootstrap',
	'rxTime'
], function ($, popupController, Rx) {

	'use strict';
	
	$('.navbar a').tooltip({ placement: 'bottom' });

	function activeProjects() {
		var subject = new Rx.AsyncSubject();
		chrome.extension.sendMessage({ name: 'activeProjects' }, function (response) {
			subject.onNext(response.serviceState);
			subject.onCompleted();
		});
		return subject;
	}

	Rx.Observable.interval(10000)
		.startWith(-1)
		.selectMany(activeProjects)
		.subscribe(function (services) {
			popupController.show(services);
		});

});
