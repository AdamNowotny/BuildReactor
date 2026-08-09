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
        await this.page.getByText(name, { exact: true }).click();
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
}
