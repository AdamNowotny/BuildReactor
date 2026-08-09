import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

const serviceTypes = [
    'Atlassian Bamboo',
    'BuildBot',
    'BuildKite',
    'CCTray XML',
    'GitHub Actions',
    'Jenkins',
    'TeamCity',
    'Travis',
];

test('options page displays all service types', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html`);

        for (const serviceType of serviceTypes) {
            await expect(page.getByText(serviceType, { exact: true })).toBeVisible();
        }
    } finally {
        await context.close();
    }
});
