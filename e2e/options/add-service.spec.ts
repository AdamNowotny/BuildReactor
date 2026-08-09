import { expect, test } from 'playwright/test';
import { launchExtension } from '../support/extension';

async function openOptions() {
    const { context, extensionId } = await launchExtension();
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);
    return { context, page };
}

test('service name is enabled after selecting a service type', async () => {
    const { context, page } = await openOptions();

    try {
        const nameInput = page.getByPlaceholder('Name');
        const addButton = page.getByRole('button', { name: 'Add', exact: true });

        await expect(nameInput).toBeDisabled();
        await expect(addButton).toBeDisabled();

        await page.getByText('Jenkins', { exact: true }).click();

        await expect(nameInput).toBeEnabled();
        await expect(addButton).toBeDisabled();

        await nameInput.fill('Test Jenkins');
        await expect(addButton).toBeEnabled();
    } finally {
        await context.close();
    }
});

test('adding a service opens its configuration page', async () => {
    const { context, page } = await openOptions();

    try {
        await page.getByText('Jenkins', { exact: true }).click();
        await page.getByPlaceholder('Name').fill('Test Jenkins');
        await page.getByRole('button', { name: 'Add', exact: true }).click();

        await expect(page).toHaveURL(/options\.html#\/new\/jenkins\/Test%20Jenkins$/);
        await expect(
            page.getByPlaceholder('Jenkins server or view URL, e.g. http://ci.jenkins-ci.org/'),
        ).toBeVisible();
        await expect(page.locator('input[type="password"]')).toHaveCount(1);
    } finally {
        await context.close();
    }
});

test('saving a service persists it after reload', async () => {
    const { context, page } = await openOptions();

    try {
        await page.getByText('Jenkins', { exact: true }).click();
        await page.getByPlaceholder('Name').fill('Test Jenkins');
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page
            .getByPlaceholder('Jenkins server or view URL, e.g. http://ci.jenkins-ci.org/')
            .fill('http://jenkins.example.test');
        await page.getByRole('button', { name: 'Save', exact: true }).click();

        await expect(page).toHaveURL(/options\.html#\/service\/Test%20Jenkins$/);
        await expect(page.getByText('Test Jenkins', { exact: true })).toBeVisible();

        await page.reload();

        await expect(page.getByText('Test Jenkins', { exact: true })).toBeVisible();
    } finally {
        await context.close();
    }
});
