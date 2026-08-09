import { chromium } from 'playwright';
import path from 'node:path';

export async function launchExtension() {
    const extensionPath = path.resolve('dist/build');
    const context = await chromium.launchPersistentContext('', {
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
        ],
        headless: false,
    });
    const browserErrors: string[] = [];
    context.on('weberror', error => browserErrors.push(error.error().message));
    const serviceWorker =
        context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    const extensionId = new URL(serviceWorker.url()).host;
    return { browserErrors, context, extensionId };
}
