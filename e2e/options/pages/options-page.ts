import { expect } from 'playwright/test';
import type { Page } from 'playwright';

export default class OptionsPage {
    constructor(private readonly page: Page) {}

    async expectServiceVisible(name: string) {
        await expect(this.service(name)).toBeVisible();
    }

    private service(name: string) {
        return this.page.getByRole('link', { name, exact: true }).first();
    }
}
