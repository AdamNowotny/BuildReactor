import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

test('renders a GitHub workflow with no runs as a green project link', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/dashboard.html`);
        await page.evaluate(async () => {
            await chrome.storage.local.set({
                state: [
                    {
                        name: 'OrangeLab',
                        items: [
                            {
                                id: '309675651 | Publish to npm',
                                name: 'Publish to npm',
                                webUrl: 'https://github.com/QC-Labs/orange-lab',
                            },
                        ],
                    },
                ],
            });
        });

        const service = page.locator('.service').filter({ hasText: 'OrangeLab' });
        const build = service.locator('.build');
        await expect(build).toBeVisible();
        await expect(build).not.toHaveClass(/broken/);
        await expect(build).not.toHaveClass(/building/);
        await expect(build).not.toHaveClass(/offline/);
        await expect(build.getByText('Offline', { exact: true })).toHaveCount(0);
        await expect(build.locator('.error-message')).toHaveCount(0);
        await expect(build.locator('.changes-container')).toBeEmpty();
        await expect(build.locator('a')).toHaveAttribute(
            'href',
            'https://github.com/QC-Labs/orange-lab',
        );
    } finally {
        await context.close();
    }
});
