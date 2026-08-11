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
                        name: 'Example Service',
                        items: [
                            {
                                id: '309675651 | Publish to npm',
                                name: 'Publish to npm',
                                webUrl: 'https://github.com/example-org/example-repository',
                            },
                        ],
                    },
                ],
            });
        });

        const service = page.locator('.service').filter({ hasText: 'Example Service' });
        const build = service.locator('.build');
        await expect(build).toBeVisible();
        await expect(build).not.toHaveClass(/broken/);
        await expect(build).not.toHaveClass(/building/);
        await expect(build).not.toHaveClass(/offline/);
        await expect(build.getByText('Offline', { exact: true })).toHaveCount(0);
        await expect(build.locator('.error-message')).toHaveCount(0);
        await expect(build.locator('.changes-container')).toBeEmpty();
        await expect(build.locator('.build-age')).toHaveCSS('display', 'none');
        await expect(build.locator('a')).toHaveAttribute(
            'href',
            'https://github.com/example-org/example-repository',
        );
    } finally {
        await context.close();
    }
});

test('shows build age only when enabled for completed builds', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/dashboard.html`);
        await page.evaluate(async () => {
            await chrome.storage.local.set({
                configuration: {
                    columns: 2,
                    fullWidthGroups: true,
                    showBuildAge: false,
                    showCommits: true,
                    showCommitsWhenGreen: true,
                    theme: 'dark',
                },
                state: [
                    {
                        name: 'Example Service',
                        items: [
                            {
                                id: '309675651 | Publish to npm',
                                isRunning: false,
                                isWaiting: false,
                                name: 'Publish to npm',
                                startedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
                                webUrl: 'https://github.com/example-org/example-repository',
                            },
                        ],
                    },
                ],
            });
        });

        const build = page
            .locator('.service')
            .filter({ hasText: 'Example Service' })
            .locator('.build');
        await expect(build.locator('.build-age')).toHaveCSS('display', 'none');

        await page.evaluate(async () => {
            await chrome.storage.local.set({
                configuration: { showBuildAge: true },
            });
        });

        await expect(build.locator('.build-age')).toBeVisible();
        await expect(build.locator('.build-age')).toHaveText(/minutes ago/);

        await page.evaluate(async () => {
            await chrome.storage.local.set({
                state: [
                    {
                        name: 'Example Service',
                        items: [
                            {
                                id: '309675651 | Publish to npm',
                                isRunning: true,
                                name: 'Publish to npm',
                                startedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
                                webUrl: 'https://github.com/example-org/example-repository',
                            },
                        ],
                    },
                ],
            });
        });
        await expect(build.locator('.build-age')).toHaveCSS('display', 'none');

        await page.evaluate(async () => {
            await chrome.storage.local.set({
                state: [
                    {
                        name: 'Example Service',
                        items: [
                            {
                                id: '309675651 | Publish to npm',
                                isRunning: false,
                                isWaiting: true,
                                name: 'Publish to npm',
                                startedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
                                webUrl: 'https://github.com/example-org/example-repository',
                            },
                        ],
                    },
                ],
            });
        });
        await expect(build.locator('.build-age')).toHaveCSS('display', 'none');
    } finally {
        await context.close();
    }
});
