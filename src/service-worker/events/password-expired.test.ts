import notification from 'service-worker/notification';
import serviceConfig from 'service-worker/storage/service-config';
import serviceState from 'service-worker/storage/service-state';
import { expect, it, vi } from 'vitest';
import passwordExpired from './password-expired';

vi.mock('common/logger');
vi.mock('service-worker/notification');
vi.mock('service-worker/storage/service-config');

it('should not show notification if no error', async () => {
    serviceState.onChanged.onNext({
        oldValue: [],
        newValue: [
            { name: 'test1', items: [] },
            {
                name: 'test2',
                items: [{ name: 'build11', id: 'build1', group: null }],
            },
        ],
    });

    await passwordExpired.init();

    expect(notification.show).not.toBeCalled();
});

it('shows notification if 401 error found', async () => {
    serviceState.onChanged.onNext({
        oldValue: [],
        newValue: [
            { name: 'test1', items: [] },
            {
                name: 'test2',
                items: [
                    {
                        name: 'build1',
                        id: 'build1',
                        group: null,
                        error: { name: 'UnauthorisedError' },
                    },
                ],
            },
        ],
    });

    await passwordExpired.init();

    expect(notification.show).toBeCalledWith({
        serviceName: 'test2',
        id: 'test2_disabled',
        title: 'test2',
        message: 'Password expired. Service has been disabled.',
        url: 'settings.html',
        requireInteraction: true,
    });
});

it('disables service on authentication error', async () => {
    serviceState.onChanged.onNext({
        oldValue: [],
        newValue: [
            {
                name: 'test name',
                items: [
                    {
                        name: 'build',
                        id: 'build',
                        group: null,
                        error: { name: 'UnauthorisedError' },
                    },
                ],
            },
        ],
    });

    await passwordExpired.init();

    expect(serviceConfig.disableService).toBeCalledWith('test name');
});
