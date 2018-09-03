import 'test/rxHelpers';
import 'rx/dist/rx.binding';
import Rx from 'rx/dist/rx.testing';
import chromeApi from 'common/chromeApi';
import core from 'common/core';

describe('common/core', () => {

    const onNext = Rx.ReactiveTest.onNext;
    let scheduler;
    let configPort, logsPort, statePort, viewsPort;

    const createPort = function() {
        return {
            onMessage: {
                addListener: () => {}
            }
        };
    };

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        configPort = createPort();
        logsPort = createPort();
        statePort = createPort();
        viewsPort = createPort();
        spyOn(chromeApi, 'connect').and.callFake((request) => {
            const ports = {
                'configuration': configPort,
                'logs': logsPort,
                'state': statePort,
                'views': viewsPort
            };
            return ports[request.name];
        });
        spyOn(chromeApi, 'sendMessage');
        spyOn(configPort.onMessage, 'addListener');
        spyOn(logsPort.onMessage, 'addListener');
        spyOn(statePort.onMessage, 'addListener');
        spyOn(viewsPort.onMessage, 'addListener');
    });

    it('should connect on init', function() {
        core.init();

        expect(chromeApi.connect.calls.argsFor(0)).toEqual([{ name: 'state' }]);
        expect(chromeApi.connect.calls.argsFor(1)).toEqual([{ name: 'configuration' }]);
        expect(chromeApi.connect.calls.argsFor(2)).toEqual([{ name: 'views' }]);
    });

    it('should pass activeProjects from port', function() {
        var state = [{ name: 'service1' }, { name: 'service2' }];
        statePort.onMessage.addListener.and.callFake(function(listener) {
            listener(state);
        });

        scheduler.scheduleAbsolute(null, 300, function() {
            core.init();
        });
        var result = scheduler.startScheduler(function() {
            return core.activeProjects;
        });

        expect(result.messages).toHaveElements(onNext(300, state));
    });

    it('should pass configurations from port', function() {
        var config = [{ name: 'service1' }, { name: 'service2' }];
        configPort.onMessage.addListener.and.callFake(function(listener) {
            listener(config);
        });

        scheduler.scheduleAbsolute(null, 300, function() {
            core.init();
        });
        var result = scheduler.startScheduler(function() {
            return core.configurations;
        });

        expect(result.messages).toHaveElements(onNext(300, config));
    });

    it('should pass view configurations from port', function() {
        var config = [{ columns: 5 }];
        viewsPort.onMessage.addListener.and.callFake(function(listener) {
            listener(config);
        });

        scheduler.scheduleAbsolute(null, 300, function() {
            core.init();
        });
        var result = scheduler.startScheduler(function() {
            return core.views;
        });

        expect(result.messages).toHaveElements(onNext(300, config));
    });

    xit('should pass logs from background page', () => {
        const error = { name: 'error', message: 'log message' };
        logsPort.onMessage.addListener.and.callFake((listener) => {
            listener(error);
        });

        scheduler.scheduleAbsolute(null, 300, () => {
            core.init();
        });
        const result = scheduler.startScheduler(() => core.messages);

        expect(result.messages).toHaveElements(onNext(300, error));
    });

    it('should send availableServices message', function() {
        var callback = function() {};

        core.availableServices(callback);

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "availableServices" }, callback);
    });

    it('should send availableProjects message', () => {
        chromeApi.sendMessage.and.callFake((message, callback) => {
            callback('result');
        });
        const settings = [];
        const callback = jasmine.createSpy();

        core.availableProjects(settings, callback);

        expect(chromeApi.sendMessage).toHaveBeenCalled();
        expect(chromeApi.sendMessage.calls.mostRecent().args[0])
            .toEqual({ name: "availableProjects", serviceSettings: settings });
        expect(callback).toHaveBeenCalled();
    });

    it('should send enableService message', function() {
        core.enableService('service');

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "enableService", serviceName: 'service' });
    });

    it('should send disableService message', function() {
        core.disableService('service');

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "disableService", serviceName: 'service' });
    });

    it('should send removeService message', function() {
        core.removeService('service');

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "removeService", serviceName: 'service' });
    });

    it('should send renameService message', function() {
        core.renameService('service', 'new service');

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({
            name: "renameService",
            oldName: 'service',
            newName: 'new service'
        });
    });

    it('should send setOrder message', function() {
        core.setOrder(['service2', 'service1']);

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "setOrder", order: ['service2', 'service1'] });
    });

    it('should send setBuildOrder message', function() {
        core.setBuildOrder('service name', ['build2', 'build1']);

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "setBuildOrder", serviceName: 'service name', order: ['build2', 'build1'] });
    });

    it('should send setViews message', function() {
        core.setViews({ columns: 5 });

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "setViews", views: { columns: 5 } });
    });

    it('should send saveConfig message', function() {
        var config = [{ name: 'service' }];

        core.saveConfig(config);

        expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "saveConfig", config: config });
    });

});
