import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

test('settings link opens the options page', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const popup = await context.newPage();
        await popup.goto(`chrome-extension://${extensionId}/popup.html`);

        const [optionsPage] = await Promise.all([
            context.waitForEvent('page'),
            popup.getByTitle('Settings').click(),
        ]);

        await expect(optionsPage).toHaveTitle('BuildReactor options');
    } finally {
        await context.close();
    }
});

test('dashboard link opens the dashboard page', async () => {
    const { context, extensionId } = await launchExtension();

    try {
        const popup = await context.newPage();
        await popup.goto(`chrome-extension://${extensionId}/popup.html`);

        const [dashboardPage] = await Promise.all([
            context.waitForEvent('page'),
            popup.getByTitle('Dashboard').click(),
        ]);

        await expect(dashboardPage).toHaveTitle('BuildReactor dashboard');
    } finally {
        await context.close();
    }
});
