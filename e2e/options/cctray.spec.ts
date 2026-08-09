import { expect, test } from 'playwright/test';
import CctrayOptionsPage from './pages/cctray-options-page';
import { launchExtension } from '../support/extension';
import { startCctrayServer } from '../support/cctray-server';

test('shows projects returned by CCTray', async () => {
    const server = await startCctrayServer();
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html`);
        const cctray = new CctrayOptionsPage(page);
        await cctray.addService('Test CCTray', server.url);
        await cctray.showProjects();

        await expect(
            page.locator('span.group-name').filter({ hasText: 'CruiseControl.NET' }),
        ).toBeVisible();
        await cctray.expandGroup('CruiseControl.NET');
        await expect(page.getByText('NetReflector', { exact: true })).toBeVisible();
    } finally {
        await context.close();
        await server.close();
    }
});
