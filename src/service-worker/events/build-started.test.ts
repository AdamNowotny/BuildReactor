import notification from 'service-worker/notification';
import viewConfig from 'service-worker/storage/view-config';
import { beforeEach, expect, it, Mock, vi } from 'vitest';
import { stateChangeHandler } from './build-started';

vi.mock('common/logger');
vi.mock('service-worker/notification');
vi.mock('service-worker/storage/service-config');
vi.mock('service-worker/storage/view-config');

beforeEach(() => {
    (viewConfig.get as Mock).mockResolvedValue({ notifications: { buildStarted: true } });
});

it('should not show notification if old state empty', async () => {
    await stateChangeHandler({
        oldValue: [],
        newValue: [
            {
                name: 'test1',
                items: [{ name: 'build11', id: 'build1', group: null, isRunning: true }],
            },
        ],
    });

    expect(notification.showBuild).not.toBeCalled();
});

it('should not show notification if notifications disabled', async () => {
    (viewConfig.get as Mock).mockResolvedValue({ notifications: { buildStarted: false } });
    await stateChangeHandler({
        oldValue: [
            {
                name: 'test1',
                items: [{ name: 'build11', id: 'build1', group: null, isRunning: false }],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [{ name: 'build11', id: 'build1', group: null, isRunning: true }],
            },
        ],
    });

    expect(notification.showBuild).not.toBeCalled();
});

it('should show notification if build started', async () => {
    (viewConfig.get as Mock).mockResolvedValue({ notifications: { buildStarted: true } });

    await stateChangeHandler({
        oldValue: [
            {
                name: 'test1',
                items: [{ name: 'build11', id: 'build1', group: null, isRunning: false }],
            },
        ],
        newValue: [
            {
                name: 'test1',
                items: [{ name: 'build11', id: 'build1', group: null, isRunning: true }],
            },
        ],
    });

    expect(notification.showBuild).toBeCalled();
    expect(notification.showBuild).toBeCalledWith(
        'test1',
        {
            id: 'build1',
            group: null,
            name: 'build11',
            isRunning: true,
        },
        'Build started'
    );
});
