import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

test('popup shows the empty state without configured services', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/popup.html`);

        await expect(page.getByText('No services configured', { exact: true })).toBeVisible();
    } finally {
        await context.close();
    }
});
