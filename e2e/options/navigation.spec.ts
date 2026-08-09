import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

const navigationCases = [
    { link: 'View', route: 'view', content: 'Number of Columns' },
    { link: 'Notifications', route: 'notifications', content: 'Build broken' },
    { link: 'Configuration', route: 'configuration', content: 'Current configuration' },
];

for (const { content, link, route } of navigationCases) {
    test(`navigates to ${link}`, async () => {
        const { context, extensionId } = await launchExtension();

        try {
            const page = await context.newPage();
            await page.goto(`chrome-extension://${extensionId}/options.html`);
            await page.getByRole('link', { name: link, exact: true }).click();

            await expect(page).toHaveURL(new RegExp(`options\\.html#/${route}$`));
            await expect(page.getByText(content, { exact: true })).toBeVisible();
        } finally {
            await context.close();
        }
    });
}
