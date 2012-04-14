define([
		'signals',
		'jquery',
		'ejs'
], function (signals, $) {

	var itemClicked = new signals.Signal();
	var itemSelected = new signals.Signal();

	var add = function (serviceInfo) {
		addItem(serviceInfo.name);
		selectLast();
	};

	var load = function (settings) {
		render(settings);
		if (!isEmpty()) {
			selectFirst();
		}
	};

	var update = function (settings) {
		var selectedIndex = getSelectedIndex();
		render(settings);
		if (!isEmpty()) {
			selectAt(selectedIndex);
		}
	};

	var getSelectedName = function () {
		return $('#service-list li.active').text();
	};

	var render = function (settings) {
		clear();
		for (var i = 0; i < settings.length; i++) {
			addItem(settings[i].name);
		}
		$('#service-list li').click(function (event) {
			event.preventDefault();
			itemClicked.dispatch(this);
		});
	};

	var selectFirst = function () {
		selectItem($('#service-list li:first')[0]);
	};

	var selectLast = function () {
		selectItem($('#service-list li:last')[0]);
	};

	var selectItem = function (linkElement) {
		var serviceLink = $(linkElement);
		if (serviceLink.hasClass('active')) return;
		$('#service-list li').removeClass('active');
		serviceLink.addClass('active');
		itemSelected.dispatch(linkElement);
	};

	var selectAt = function (index) {
		var lastIndex = $('#service-list li:last').index();
		if (isEmpty()) {
			return;
		}
		if (index > lastIndex) {
			index = lastIndex;
		}
		var menuItem = $('#service-list li').eq(index);
		selectItem(menuItem);
	};

	var isEmpty = function () {
		var lastIndex = $('#service-list li:last').index();
		return lastIndex < 0;
	};

	var getSelectedIndex = function () {
		return $('#service-list li.active').index();
	};

	var clear = function () {
		$('#service-list').html('');
	};

	var addItem = function (name) {
		var index = $('#service-list li').length;
		var html = '<li data-service-index="' + index + '"><a href="#">' + name + '</a></li>';
		$("#service-list").append(html);
	};

	return {
		load: load,
		update: update,
		add: add,
		itemClicked: itemClicked,
		itemSelected: itemSelected,
		selectItem: selectItem,
		getSelectedName: getSelectedName
	};
});