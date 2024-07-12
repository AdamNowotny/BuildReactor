import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
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
    },
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

describe('show', () => {
    it('shows notifications', async () => {
        await notification.show(testInfo);

        expect(mockChrome.notifications.create).toBeCalledWith(
            testInfo.id,
            expect.objectContaining({
                type: 'basic',
                title: testInfo.title,
                message: testInfo.message,
                requireInteraction: true,
            })
        );
    });

    it('adds iconUrl', async () => {
        (mockChrome.runtime.getURL as Mock).mockImplementation(
            icon => `https://google.com/${icon}`
        );

        await notification.show(testInfo);

        expect(mockChrome.runtime.getURL).toBeCalledWith(`services/baseUrl/icon.png`);
        expect(mockChrome.notifications.create).toBeCalledWith(
            testInfo.id,
            expect.objectContaining({
                iconUrl: `https://google.com/services/baseUrl/icon.png`,
            })
        );
    });

    it('should not show when notifications disabled', async () => {
        (viewConfig.get as Mock).mockResolvedValue({ notifications: { enabled: false } });

        await notification.show(testInfo);

        expect(mockChrome.notifications.create).not.toBeCalled();
    });

    it('shows url when notification clicked', async () => {
        let onClickedHandler;
        mockChrome.notifications.onClicked.addListener.mockImplementation(callback => {
            onClickedHandler = callback;
        });

        notification.init();
        await notification.show(testInfo);
        onClickedHandler(testInfo.id);

        expect(mockChrome.tabs.create).toBeCalledWith({ url: testInfo.url });
    });
});

describe('showBuild', () => {
    it('shows notification for build', async () => {
        await notification.showBuild(
            'serviceName',
            { group: 'group', name: 'name', id: 'id', webUrl: 'webUrl' },
            'text'
        );

        expect(mockChrome.notifications.create).toBeCalledWith(
            'serviceName_group_id',
            expect.objectContaining({
                type: 'basic',
                title: `text (serviceName)`,
                message: 'group / name',
            })
        );
    });

    it('shows notification for build with no group', async () => {
        await notification.showBuild(
            'serviceName',
            { group: null, name: 'name', id: 'id' },
            'text'
        );

        expect(mockChrome.notifications.create).toBeCalledWith(
            'serviceName_id',
            expect.objectContaining({
                title: `text (serviceName)`,
                message: 'name',
            })
        );
    });

    it('shows build notification with changes', async () => {
        await notification.showBuild(
            'serviceName',
            {
                group: 'group',
                name: 'name',
                id: 'id',
                changes: [
                    { name: 'name1', message: 'message1' },
                    { name: 'name2', message: 'message2' },
                    { name: 'name3', message: 'message3' },
                    { name: 'name4', message: 'message4' },
                ],
            },
            'text'
        );

        expect(mockChrome.notifications.create).toBeCalledWith(
            `${'serviceName'}_${'group'}_${'id'}`,
            expect.objectContaining({
                message: 'group / name\nname1: message1\nname2: message2\n...\n',
            })
        );
    });

    it('shows build notification with unique changes', async () => {
        await notification.showBuild(
            'serviceName',
            {
                group: 'group',
                name: 'name',
                id: 'id',
                changes: [
                    { name: 'name1', message: 'message1' },
                    { name: 'name2', message: 'message2' },
                    { name: 'name1', message: 'message3' },
                ],
            },
            'text'
        );

        expect(mockChrome.notifications.create).toBeCalledWith(
            `${'serviceName'}_${'group'}_${'id'}`,
            expect.objectContaining({
                message: 'group / name\nname1: message1\nname2: message2',
            })
        );
    });

    it('shows notification with changes with no message', async () => {
        await notification.showBuild(
            'serviceName',
            {
                group: 'group',
                name: 'name',
                id: 'id',
                changes: [{ name: 'name1' }, { name: 'name2' }, { name: 'name1' }],
            },
            'text'
        );

        expect(mockChrome.notifications.create).toBeCalledWith(
            `${'serviceName'}_${'group'}_${'id'}`,
            expect.objectContaining({
                message: 'group / name\nname1\nname2',
            })
        );
    });
});
