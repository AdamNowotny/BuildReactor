---
name: testing
description: Use when adding or updating BuildReactor Vitest or Playwright tests, especially extension page, service-worker, options, popup, dashboard, or CI-service coverage.
---

# BuildReactor Testing

## Choose The Layer

Use the smallest layer that proves the behavior:

- Use Vitest for service parsing, storage logic, service-worker business logic, and other code that does not need a browser.
- Use Playwright for built-extension behavior, browser APIs, extension storage, page navigation, rendering, and service-worker startup.
- Do not use Playwright to duplicate unit tests or test React implementation details.
- Do not extract production logic only to make a test possible. Test existing boundaries or use the browser when the behavior is genuinely browser-specific.

## Structure

Keep unit tests beside the source as `*.test.ts` or `*.test.tsx`. Keep Playwright tests under `e2e/`, grouped by product surface such as `options/`, `dashboard/`, `popup/`, and `runtime/`.

Keep each test focused on one behavior. Separate page loading, empty states, navigation, service configuration, and service-backed behavior rather than combining them into one end-to-end scenario. Use a shared helper for extension startup, not repeated launch setup in every test.

Use a fresh Playwright extension context by default. This keeps `chrome.storage.local` isolated and makes tests independent. Share a context only when persistence across pages is the behavior under test.

## Extension Constraints

Playwright tests load the built Chrome extension with `e2e/support/extension.ts`. The extension must run in headed Chromium, so CI needs a display such as Xvfb.

Page-load tests should capture UI `pageerror` events, error-level console messages, and browser-context `weberror` events. The latter also catches uncaught extension service-worker errors. These checks prove startup and rendering only; they do not prove CI requests, polling, response parsing, badges, or notifications.

The popup and dashboard share most rendering code. Test shared dashboard behavior once and reserve popup tests for popup-specific behavior such as its links, navbar, dimensions, or empty state.

## What To Test

For service-free UI behavior, prioritize:

- Empty states for a new installation.
- User-visible navigation and destination content.
- Service-type selection, configuration form state, and save/reload persistence.
- Settings controls and extension links.

For CI data behavior, test the service adapter and service-worker logic with Vitest where possible. Use Playwright only for the integrated flow that needs browser APIs or real extension storage.

Do not click `Show`, test polling, or assert build data until deterministic service responses are available. Never call real CI services from automated tests.

## Service-Backed Boundary

When a test needs CI responses, add a deterministic local mock HTTP server before adding the test. Keep the mock contract small and explicit, with controlled success, empty, malformed, authentication-error, timeout, and state-transition responses. Keep service-free UI tests independent from that infrastructure.

## Maintainability

Prefer user-facing selectors: roles, exact visible text, placeholders that are part of the UI contract, titles, and URLs. Avoid CSS classes, generated markup, React component names, and incidental DOM structure.

Use data-driven cases only when the behavior is genuinely identical. Do not parameterize unrelated flows merely to reduce line count. Assertions should describe observable behavior and avoid duplicating implementation details.

When a test fails, preserve useful Playwright artifacts locally or in CI, but do not commit `test-results/` or `playwright-report/`.

## Commands

```bash
npm test
npx vitest run src/services/jenkins/jenkins.test.ts
npx vitest run -t "getPipelines"
npm run e2e
npx playwright test e2e/options
npx playwright test e2e/dashboard
npx playwright test e2e/popup
npx playwright test e2e/options/add-service.spec.ts
npm run lint
npm run typecheck
```

Before finishing, run `git diff --check` and verify generated test artifacts are not staged.
