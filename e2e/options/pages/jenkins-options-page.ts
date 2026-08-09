import { expect } from 'playwright/test';
import type { Page } from 'playwright';

export default class JenkinsOptionsPage {
    constructor(private readonly page: Page) {}

    async addService(name: string, url: string) {
        await this.page.getByText('Jenkins', { exact: true }).click();
        await this.page.getByPlaceholder('Name').fill(name);
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page
            .getByPlaceholder('Jenkins server or view URL, e.g. http://ci.jenkins-ci.org/')
            .fill(url);
    }

    async showProjects() {
        await this.page.getByRole('button', { name: 'Show', exact: true }).click();
    }

    async expandGroup(name: string) {
        await this.group(name).click();
    }

    async expectGroupAbsent(name: string) {
        await expect(this.group(name)).toHaveCount(0);
    }

    async expectGroupVisible(name: string) {
        await expect(this.group(name)).toBeVisible();
    }

    async expectPipelineVisible(name: string) {
        await expect(this.page.getByText(name, { exact: true })).toBeVisible();
    }

    async expectSelectedPipeline(id: string) {
        await expect(this.page.locator('.selected-pipelines .project-name')).toHaveText(id);
    }

    async selectPipeline(name: string) {
        const row = this.page
            .getByText(name, { exact: true })
            .locator('..')
            .locator('..')
            .locator('..');
        await row.getByRole('checkbox').check();
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save', exact: true }).click();
    }

    private group(name: string) {
        return this.page.locator('span.group-name').filter({ hasText: name });
    }
}
