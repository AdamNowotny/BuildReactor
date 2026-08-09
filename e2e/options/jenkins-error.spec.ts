import { expect, test } from 'playwright/test';
import JenkinsOptionsPage from './pages/jenkins-options-page';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';

test('shows an error when Jenkins project discovery fails', async () => {
    const server = await startJenkinsServer({ failProjects: true });
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(page);
        await jenkins.addService('Offline Jenkins', server.url);
        await jenkins.showProjects();

        await expect(page.getByText('RequestError: Connection failed')).toBeVisible();
        await jenkins.expectGroupAbsent('Core');
    } finally {
        await context.close();
        await server.close();
    }
});
