import { beforeAll, beforeEach, expect, it, Mock, vi } from 'vitest';
import stateStorage from './storage/service-state';
import notification, { NotificationInfo } from './notification';
import serviceConfig from './storage/service-config';
import viewConfig from './storage/view-config';

const mockChrome = {
    notifications: {
        onClicked: {
            addListener: vi.fn(),
        },
        onClosed: {
            addListener: vi.fn(),
        },
        create: vi.fn(),
    },
    tabs: {
        create: vi.fn(),
    },
    runtime: {
        getURL: vi.fn(),
    }
};
vi.stubGlobal('chrome', mockChrome);
vi.mock('common/logger');
vi.mock('./storage/service-config');
vi.mock('./storage/view-config');

beforeEach(() => {
    (serviceConfig.getItem as Mock).mockResolvedValue({ baseUrl: 'baseUrl' });
    (viewConfig.get as Mock).mockResolvedValue({ notifications: { enabled: true } });
});

const testInfo: NotificationInfo = {
    serviceName: 'serviceName',
    id: 'id',
    title: 'title',
    message: 'message',
    url: 'settings.html',
    requireInteraction: true,
};

it('shows notifications', async () => {
    await notification.show(testInfo);

    expect(mockChrome.notifications.create).toBeCalledWith(testInfo.id, expect.objectContaining({
        type: 'basic',
        title: testInfo.title,
        message: testInfo.message,
        requireInteraction: true,
    }));
});

it('adds iconUrl', async() => {
    (mockChrome.runtime.getURL as Mock).mockImplementation((icon) => `https://google.com/${icon}`);

    await notification.show(testInfo);

    expect(mockChrome.runtime.getURL).toBeCalledWith(`services/baseUrl/icon.png`);
    expect(mockChrome.notifications.create).toBeCalledWith(testInfo.id, expect.objectContaining({
        iconUrl: `https://google.com/services/baseUrl/icon.png`,
    }));
});

it('should not show when notifications disabled', async () => {
    (viewConfig.get as Mock).mockResolvedValue({ notifications: { enabled: false } });

    await notification.show(testInfo);

    expect(mockChrome.notifications.create).not.toBeCalled();
});

it.only('shows url when notification clicked', async () => {
    let onClickedHandler;
    mockChrome.notifications.onClicked.addListener.mockImplementation((callback) => {
        onClickedHandler = callback;
    });

    notification.init();
    await notification.show(testInfo);
    onClickedHandler(testInfo.id);

    expect(mockChrome.tabs.create).toBeCalledWith({ url: testInfo.url });
});
