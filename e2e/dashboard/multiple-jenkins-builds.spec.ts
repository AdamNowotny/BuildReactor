import { expect, test } from 'playwright/test';
import JenkinsOptionsPage from '../options/pages/jenkins-options-page';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';

test('renders multiple selected Jenkins pipelines', async () => {
    const server = await startJenkinsServer();
    const { context, extensionId } = await launchExtension();

    try {
        const options = await context.newPage();
        await options.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(options);
        await jenkins.addService('Test Jenkins', server.url);
        await jenkins.showProjects();

        await jenkins.expandGroup('Infrastructure');
        await jenkins.selectPipeline('patron');
        await jenkins.expandGroup('job23');
        await jenkins.selectPipeline('master');
        await jenkins.expandGroup('Projects');
        await jenkins.selectPipeline('freestyle-project');
        await jenkins.save();

        const dashboard = await context.newPage();
        await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
        const service = dashboard.locator('.service').filter({ hasText: 'Test Jenkins' });
        await expect(service).toBeVisible();
        await expect(service.locator('.build-name')).toHaveText([
            'freestyle-project',
            'master',
            'patron',
        ]);
        await expect(service.locator('.group-name')).toHaveText(['job23', 'Infrastructure']);
    } finally {
        await context.close();
        await server.close();
    }
});
