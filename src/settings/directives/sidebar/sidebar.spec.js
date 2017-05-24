import 'settings/directives/sidebar/sidebar';
import angular from 'angular';
import core from 'common/core';
import sinon from 'sinon';

describe('settings/directives/sidebar/sidebar', () => {

    let scope;
    let element;

    beforeEach(angular.mock.module('settings'));

    beforeEach(() => {
        sinon.stub(core, 'setOrder');
    });

    afterEach(() => {
        core.setOrder.restore();
    });

    beforeEach(angular.mock.inject(($compile, $rootScope) => {
        element = $compile('<section sidebar services="services" configs="[]" new="false"></section>')($rootScope);
        $rootScope.$digest();
        scope = element.isolateScope();
    }));

    it('should call setOrder when order changed', () => {
        const service1 = { name: 'service1' };
        const service2 = { name: 'service2' };
        core.configurations.onNext([[service1, service2]]);

        scope.sortableConfig.onUpdate({ models: [service2, service1] });

        sinon.assert.calledWith(core.setOrder, ['service2', 'service1']);
    });

});
