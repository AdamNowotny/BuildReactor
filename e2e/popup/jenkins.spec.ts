import { expect, test } from 'playwright/test';
import JenkinsOptionsPage from '../options/pages/jenkins-options-page';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';

test('renders a configured Jenkins build in the popup', async () => {
    const server = await startJenkinsServer();
    const { context, extensionId } = await launchExtension();

    try {
        const options = await context.newPage();
        await options.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(options);
        await jenkins.addService('Test Jenkins', server.url);
        await jenkins.showProjects();
        await jenkins.expandGroup('job23');
        await jenkins.selectPipeline('master');
        await jenkins.save();

        const popup = await context.newPage();
        await popup.goto(`chrome-extension://${extensionId}/popup.html`);
        const service = popup.locator('.service').filter({ hasText: 'Test Jenkins' });
        await expect(service).toBeVisible();
        await expect(service.locator('.build-name')).toHaveText('master');
    } finally {
        await context.close();
        await server.close();
    }
});
