import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';
import JenkinsOptionsPage from './pages/jenkins-options-page';

test('shows projects returned by Jenkins', async () => {
    const server = await startJenkinsServer();
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(page);
        await jenkins.addService('Test Jenkins', server.url);
        await jenkins.showProjects();

        await jenkins.expectGroupVisible('Core');
        await jenkins.expandGroup('Core');
        await jenkins.expectPipelineVisible('acceptance-test-harness / PR-238');
        await expect(page.getByText('Disabled', { exact: true }).first()).toBeVisible();
    } finally {
        await context.close();
        await server.close();
    }
});
