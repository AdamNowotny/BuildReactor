import type { Page } from 'playwright';

export default class CctrayOptionsPage {
    constructor(private readonly page: Page) {}

    async addService(name: string, url: string) {
        await this.page.getByText('CCTray XML', { exact: true }).click();
        await this.page.getByPlaceholder('Name').fill(name);
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.getByPlaceholder('Server URL (cctray XML)').fill(url);
    }

    async showProjects() {
        await this.page.getByRole('button', { name: 'Show', exact: true }).click();
    }

    async expandGroup(name: string) {
        await this.page.locator('span.group-name').filter({ hasText: name }).click();
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
