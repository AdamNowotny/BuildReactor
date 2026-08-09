import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';
import JenkinsOptionsPage from '../options/pages/jenkins-options-page';

test('renders a Jenkins build after configuring a pipeline', async () => {
    const server = await startJenkinsServer();
    const { context, extensionId } = await launchExtension();

    try {
        const options = await context.newPage();
        await options.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(options);
        await jenkins.addService('Test Jenkins', server.url);
        await jenkins.showProjects();
        await jenkins.expandGroup('job23');
        await expect(options.getByText('master', { exact: true })).toBeVisible();
        await jenkins.selectPipeline('master');
        await jenkins.save();

        const dashboard = await context.newPage();
        await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
        const service = dashboard.locator('.service').filter({ hasText: 'Test Jenkins' });
        await expect(service).toBeVisible();
        await expect(service.locator('.group-name')).toContainText('job23');
        await expect(service.locator('.build-name')).toHaveText('master');
        await expect(service.getByText('Canceled', { exact: true })).toBeVisible();
    } finally {
        await context.close();
        await server.close();
    }
});
