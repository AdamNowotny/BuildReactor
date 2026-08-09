import { expect, test } from 'playwright/test';
import JenkinsOptionsPage from './pages/jenkins-options-page';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';

test('persists a selected Jenkins pipeline after reload', async () => {
    const server = await startJenkinsServer();
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(page);
        await jenkins.addService('Test Jenkins', server.url);
        await jenkins.showProjects();
        await jenkins.expandGroup('job23');
        await jenkins.selectPipeline('master');
        await jenkins.save();

        await page.reload();

        await expect(page.locator('.selected-pipelines .project-name')).toHaveText(
            'job23/master',
        );
    } finally {
        await context.close();
        await server.close();
    }
});
