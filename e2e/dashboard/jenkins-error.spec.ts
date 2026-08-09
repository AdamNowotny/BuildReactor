import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';
import JenkinsOptionsPage from '../options/pages/jenkins-options-page';

test('keeps the dashboard visible when Jenkins build details fail', async () => {
    const server = await startJenkinsServer({ failBuilds: true });
    const { browserErrors, context, extensionId } = await launchExtension();

    try {
        const options = await context.newPage();
        await options.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(options);
        await jenkins.addService('Offline Jenkins', server.url);
        await jenkins.showProjects();
        await jenkins.expandGroup('job23');
        await jenkins.selectPipeline('master');
        await jenkins.save();

        const dashboard = await context.newPage();
        await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
        const service = dashboard.locator('.service').filter({ hasText: 'Offline Jenkins' });
        await expect(service).toBeVisible();
        await expect(service.locator('.build.offline')).toBeVisible();
        await expect(service.locator('.build-name')).toHaveText('master');
        expect(browserErrors).toEqual([]);
    } finally {
        await context.close();
        await server.close();
    }
});
