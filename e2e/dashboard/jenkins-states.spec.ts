import { expect, test } from 'playwright/test';
import jobDetails from '../../src/services/jenkins/jobDetails.json' with { type: 'json' };
import JenkinsOptionsPage from '../options/pages/jenkins-options-page';
import { launchExtension } from '../support/extension';
import { startJenkinsServer } from '../support/jenkins-server';

const stateCases = [
    {
        buildDetails: {
            ...jobDetails,
            lastCompletedBuild: { result: 'FAILURE' },
        },
        className: 'broken',
        label: 'failed',
    },
    {
        buildDetails: {
            ...jobDetails,
            lastBuild: { ...jobDetails.lastBuild, building: true },
        },
        className: 'building',
        label: 'running',
    },
];

for (const { buildDetails, className, label } of stateCases) {
    test(`renders a ${label} Jenkins build`, async () => {
        const server = await startJenkinsServer({ buildDetails });
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

            const dashboard = await context.newPage();
            await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
            const service = dashboard.locator('.service').filter({ hasText: 'Test Jenkins' });
            await expect(service.locator(`.build.${className}`)).toBeVisible();
        } finally {
            await context.close();
            await server.close();
        }
    });
}
