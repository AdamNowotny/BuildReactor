import { expect, test } from 'playwright/test';
import CctrayOptionsPage from '../options/pages/cctray-options-page';
import { launchExtension } from '../support/extension';
import { startCctrayServer } from '../support/cctray-server';

test('renders a running CCTray build after configuring a project', async () => {
    const server = await startCctrayServer();
    const { context, extensionId } = await launchExtension();

    try {
        const options = await context.newPage();
        await options.goto(`chrome-extension://${extensionId}/options.html`);
        const cctray = new CctrayOptionsPage(options);
        await cctray.addService('Test CCTray', server.url);
        await cctray.showProjects();
        await cctray.expandGroup('CruiseControl.NET');
        await cctray.selectPipeline('FastForward.NET');
        await cctray.save();

        const dashboard = await context.newPage();
        await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
        const service = dashboard.locator('.service').filter({ hasText: 'Test CCTray' });
        await expect(service).toBeVisible();
        await expect(service.locator('.group-name')).toHaveText('CruiseControl.NET');
        await expect(service.locator('.build-name')).toHaveText('FastForward.NET');
        await expect(service.locator('.build.building')).toBeVisible();
    } finally {
        await context.close();
        await server.close();
    }
});
