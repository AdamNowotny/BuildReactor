import { expect, test } from 'playwright/test';
import JenkinsOptionsPage from './pages/jenkins-options-page';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';

test('shows an error when Jenkins returns malformed project data', async () => {
    const server = await startJenkinsServer({ projectsBody: {} });
    const { context, extensionId } = await launchExtension();

    try {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html`);
        const jenkins = new JenkinsOptionsPage(page);
        await jenkins.addService('Malformed Jenkins', server.url);
        await jenkins.showProjects();

        await expect(page.getByText('Error: No jobs found')).toBeVisible();
        await expect(page.getByText('Core', { exact: true })).toHaveCount(0);
    } finally {
        await context.close();
        await server.close();
    }
});
