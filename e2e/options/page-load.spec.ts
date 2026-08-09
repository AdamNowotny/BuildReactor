import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

test('options page loads without browser errors', async () => {
    const { browserErrors, context, extensionId } = await launchExtension();

    try {
        const pageErrors: Error[] = [];
        const consoleErrors: string[] = [];
        const page = await context.newPage();
        page.on('pageerror', error => pageErrors.push(error));
        page.on('console', message => {
            if (message.type() === 'error') consoleErrors.push(message.text());
        });

        await page.goto(`chrome-extension://${extensionId}/options.html`);

        await expect(page).toHaveTitle('BuildReactor options');
        await expect(page.locator('#app')).not.toBeEmpty();
        expect(pageErrors).toEqual([]);
        expect(consoleErrors).toEqual([]);
        expect(browserErrors).toEqual([]);
    } finally {
        await context.close();
    }
});
