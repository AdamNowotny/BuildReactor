import notification from 'service-worker/notification';
import viewConfig from 'service-worker/storage/view-config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import buildFinished, { stateChangeHandler } from './build-finished';

vi.mock('common/logger');
vi.mock('service-worker/notification');
vi.mock('service-worker/storage/service-config');

let testConfig;

beforeEach(() => {
    testConfig = {
        notifications: {
            enabled: true,
            buildStarted: true,
            buildBroken: true,
            buildFixed: true,
            buildSuccessful: true,
            buildStillFailing: true,
        },
    };
    buildFinished.init();
    viewConfig.onChanged.onNext({ oldValue: {}, newValue: testConfig });
});

it('should not show notification if old state empty', () => {
    stateChangeHandler({
        oldValue: [],
        newValue: [
            {
                name: 'test1',
                items: [{ name: 'build1', id: 'build1', group: null, isRunning: false }],
            },
        ],
    });

    expect(notification.showBuild).not.toBeCalled();
});

it('should not show notification if still running', () => {
    stateChangeHandler({
        oldValue: [
            {
                name: 'test1',
                items: [{ name: 'build1', id: 'build1', group: null, isRunning: true }],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [
                    { name: 'build1', id: 'build1', group: null, isRunning: true, isBroken: true },
                ],
            },
        ],
    });

    expect(notification.showBuild).not.toBeCalled();
});

describe('build broken', () => {
    const stateChange = {
        oldValue: [
            {
                name: 'test1',
                items: [
                    {
                        name: 'build1',
                        id: 'build1',
                        group: null,
                        isRunning: true,
                        isBroken: false,
                    },
                ],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [
                    {
                        name: 'build1',
                        id: 'build1',
                        group: null,
                        isRunning: false,
                        isBroken: true,
                    },
                ],
            },
        ],
    };

    it('should show notification', () => {
        stateChangeHandler(stateChange);

        expect(notification.showBuild).toBeCalled();
        expect(notification.showBuild).toBeCalledWith(
            'test1',
            expect.objectContaining({ id: 'build1' }),
            'Build broken'
        );
    });

    it('should not show notification if notifications disabled', () => {
        testConfig.notifications.buildBroken = false;
        viewConfig.onChanged.onNext({ oldValue: {}, newValue: testConfig });

        stateChangeHandler(stateChange);

        expect(notification.showBuild).not.toBeCalled();
    });
});

describe('build fixed', () => {
    const stateChange = {
        oldValue: [
            {
                name: 'test1',
                items: [
                    { name: 'build1', id: 'build1', group: null, isRunning: true, isBroken: true },
                ],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [
                    {
                        name: 'build1',
                        id: 'build1',
                        group: null,
                        isRunning: false,
                        isBroken: false,
                    },
                ],
            },
        ],
    };

    it('should show notification', () => {
        stateChangeHandler(stateChange);

        expect(notification.showBuild).toBeCalled();
        expect(notification.showBuild).toBeCalledWith(
            'test1',
            expect.objectContaining({ id: 'build1' }),
            'Build fixed'
        );
    });

    it('should not show notification if notifications disabled', () => {
        testConfig.notifications.buildFixed = false;
        viewConfig.onChanged.onNext({ oldValue: {}, newValue: testConfig });

        stateChangeHandler(stateChange);

        expect(notification.showBuild).not.toBeCalled();
    });
});

describe('build successful', () => {
    const stateChange = {
        oldValue: [
            {
                name: 'test1',
                items: [{ name: 'build1', id: 'build1', group: null, isRunning: true }],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [{ name: 'build1', id: 'build1', group: null, isRunning: false }],
            },
        ],
    };

    it('should show notification', () => {
        stateChangeHandler(stateChange);

        expect(notification.showBuild).toBeCalled();
        expect(notification.showBuild).toBeCalledWith(
            'test1',
            expect.objectContaining({ id: 'build1' }),
            'Build finished'
        );
    });

    it('should not show notification if notifications disabled', () => {
        testConfig.notifications.buildSuccessful = false;
        viewConfig.onChanged.onNext({ oldValue: {}, newValue: testConfig });

        stateChangeHandler(stateChange);

        expect(notification.showBuild).not.toBeCalled();
    });
});

describe('build still broken', () => {
    const stateChange = {
        oldValue: [
            {
                name: 'test1',
                items: [
                    { name: 'build1', id: 'build1', group: null, isRunning: true, isBroken: true },
                ],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [
                    {
                        name: 'build1',
                        id: 'build1',
                        group: null,
                        isRunning: false,
                        isBroken: true,
                    },
                ],
            },
        ],
    };

    it('should show notification', () => {
        stateChangeHandler(stateChange);

        expect(notification.showBuild).toBeCalled();
        expect(notification.showBuild).toBeCalledWith(
            'test1',
            expect.objectContaining({
                id: 'build1',
            }),
            'Build still failing'
        );
    });

    it('should not show notification if notifications disabled', () => {
        testConfig.notifications.buildStillFailing = false;
        viewConfig.onChanged.onNext({ oldValue: {}, newValue: testConfig });

        stateChangeHandler(stateChange);

        expect(notification.showBuild).not.toBeCalled();
    });
});

describe('build unstable', () => {
    const stateChange = {
        oldValue: [
            {
                name: 'test1',
                items: [
                    { name: 'build1', id: 'build1', group: null, isRunning: true, isBroken: false },
                ],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [
                    {
                        name: 'build1',
                        id: 'build1',
                        group: null,
                        isRunning: false,
                        isBroken: true,
                        tags: [{ name: 'Unstable' }],
                    },
                ],
            },
        ],
    };

    it('should show notification', () => {
        stateChangeHandler(stateChange);

        expect(notification.showBuild).toBeCalled();
        expect(notification.showBuild).toBeCalledWith(
            'test1',
            expect.objectContaining({
                id: 'build1',
            }),
            'Build unstable'
        );
    });

    it('should not show notification if notifications disabled', () => {
        testConfig.notifications.buildBroken = false;
        viewConfig.onChanged.onNext({ oldValue: {}, newValue: testConfig });

        stateChangeHandler(stateChange);

        expect(notification.showBuild).not.toBeCalled();
    });
});
