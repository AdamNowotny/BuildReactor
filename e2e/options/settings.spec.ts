import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

test('view settings render and allow selecting a theme', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html#/view`);

        await expect(page.getByText('Number of Columns', { exact: true })).toBeVisible();
        const lightTheme = page.getByText('Light', { exact: true });
        await lightTheme.click();
        await expect(lightTheme).toHaveClass(/active/);
    } finally {
        await context.close();
    }
});

test('notification settings render and enable notification options', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html#/notifications`);

        const notificationField = page.getByText('Notifications', { exact: true }).locator('..');
        const buildBrokenField = page.getByText('Build broken', { exact: true }).locator('..');
        const notifications = notificationField.getByText('On', { exact: true });
        const buildBroken = buildBrokenField.getByText('Off', { exact: true });

        await notifications.click();
        await buildBroken.click();
        await expect(buildBroken).toHaveClass(/active/);
    } finally {
        await context.close();
    }
});
