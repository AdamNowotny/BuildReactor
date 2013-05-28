define([
	'jquery',
	'hbs!templates/popup',
	'popup/messages',
	'rx',
	'common/sortBy'
], function ($, popupTemplate, messages, Rx, sortBy) {

	'use strict';
	
	function popupController() {

		function show(state) {
			var model = createModel(state);
			var html = popupTemplate({ services: model });
			$('.service-info-container').html(html);
		}

		function createModel(state) {
			return state.map(function (serviceState) {
				sortBy('group', serviceState.items);
				var failedCount = serviceState.items.filter(function (item) {
					return item.isBroken && !item.isDisabled && !item.error;
				}).length;
				return {
					name: serviceState.name,
					failedCount: failedCount,
					groups: getGroups(serviceState.items)
				};
			});
		}

		function getGroups(rows) {
			var model = [];
			Rx.Observable.fromArray(rows).groupBy(function (item) {
				return item.group || '';
			}).subscribe(function (group) {
				var groupModel = {
					name: group.key,
					items: []
				};
				model.push(groupModel);
				group.subscribe(function (item) {
					groupModel.items.push(item);
				});
			});
			return model;
		}

		return messages.activeProjects.subscribe(function (services) {
			if (services) {
				show(services);
				$('.label').tooltip();
			}
		});
	}

	return popupController;
});
