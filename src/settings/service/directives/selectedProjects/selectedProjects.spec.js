import 'settings/service/directives/selectedProjects/selectedProjects';
import angular from 'angular';
import core from 'common/core';
import sinon from 'sinon';

describe('selectedProjects', () => {

    let scope;
    let element;

    beforeEach(angular.mock.module('settings'));

    beforeEach(() => {
        sinon.stub(core, 'setBuildOrder');
    });

    afterEach(() => {
        core.setBuildOrder.restore();
    });

    beforeEach(angular.mock.inject(($compile, $rootScope) => {
        element = $compile('<section selected-projects projects="projects" service-name="service name"></section>')($rootScope);
        $rootScope.$digest();
        scope = element.isolateScope();
    }));

    it('should call setBuildOrder when order changed', () => {
        scope.projects = ['name1', 'name2'];

        scope.sortableConfig.onUpdate({ models: ['name2', 'name1'] });

        sinon.assert.calledWith(core.setBuildOrder, 'service name', ['name2', 'name1']);
    });

});
