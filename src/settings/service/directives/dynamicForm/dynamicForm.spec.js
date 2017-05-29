import 'settings/service/directives/dynamicForm/dynamicForm';
import angular from 'angular';

describe('dynamicForm', () => {

    let scope;

    beforeEach(angular.mock.module('settings'));

    beforeEach(angular.mock.inject(($compile, $rootScope) => {
        const element = $compile('<section dynamic-form service="service" config="config"></section>')($rootScope);
        $rootScope.$digest();
        scope = element.isolateScope();
    }));

    it('should add missing fields to config', () => {
        scope.service = {
            defaultConfig: {
                url: '',
                username: 'guest'
            }
        };
        scope.config = {
            url: 'http://localhost/'
        };

        scope.$digest();

        expect(scope.config.url).toBe('http://localhost/');
        expect(scope.config.username).toBe('guest');
    });

    it('should generate fields if not specified', () => {
        scope.service = {
            defaultConfig: {
                url: '',
                username: '',
                password: '',
                token: '',
                updateInterval: 60
            }
        };
        scope.config = {
            url: 'http://localhost/'
        };

        scope.$digest();

        expect(scope.service.fields).toEqual([
            jasmine.objectContaining({ type: 'url' }),
            jasmine.objectContaining({ type: 'username' }),
            jasmine.objectContaining({ type: 'password' }),
            jasmine.objectContaining({ type: 'token' }),
            jasmine.objectContaining({ type: 'updateInterval' })
        ]);
    });

    it('should emit dynamicForm.changed on config change', () => {
        scope.config = {
            url: ''
        };
        const events = [];
        scope.$on('dynamicForm.changed', (event, config) => {
            events.push(config);
        });

        scope.$digest();

        expect(events.length).toBe(1);
        expect(events[0]).toEqual(scope.config);
    });

});
