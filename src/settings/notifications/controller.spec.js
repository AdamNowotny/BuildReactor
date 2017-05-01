import 'settings/notifications/controller';
import angular from 'angular';
import core from 'common/core';

describe('settings/notifications/controller', () => {

	let scope;

	beforeEach(() => {
		spyOn(core, 'setViews');
	});

	beforeEach(angular.mock.module('settings'));

	beforeEach(angular.mock.inject(($controller, $compile, $rootScope) => {
		scope = $rootScope.$new();
		$controller('NotificationsCtrl', { $scope: scope });
	}));

	it('should set config on scope', () => {
		const config = { notifications: { enabled: true } };

		core.views.onNext(config);
		scope.$digest();

		expect(scope.config).toEqual(config);
	});

	it('should save when field set', () => {
		scope.config = { notifications: { enabled: true } };

		scope.setField('enabled', false);

		expect(core.setViews).toHaveBeenCalledWith({ notifications: { enabled: false } });
	});

	it('should not save when field did not change', () => {
		scope.config = { notifications: { enabled: true } };

		scope.setField('enabled', true);

		expect(core.setViews).not.toHaveBeenCalled();
	});

});
