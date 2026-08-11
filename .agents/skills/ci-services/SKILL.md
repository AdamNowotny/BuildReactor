---
name: ci-services
description: Use when adding or updating BuildReactor CI service adapters, response parsing, provider fields, service fixtures, or service-specific tests.
---

# BuildReactor CI Services

## Adapter Workflow

Trace the complete adapter boundary before editing:

1. Locate the service definition and settings fields.
2. Locate request construction and provider-specific field selectors.
3. Locate the response fixture used by tests.
4. Locate the parser that produces `CIPipeline` or `CIBuild`.
5. Locate exact request assertions and parsed-result assertions.

Do not assume an existing fixture contains every field available from the
provider. Check the provider API documentation or a current representative
response when adding a parsed field. Treat old fixtures as test data, not as the
complete API contract.

## Request Fields

Determine whether the provider requires an explicit field expansion before
parsing a new response property. Common examples include:

- Jenkins `tree` query fields
- TeamCity `fields` query expressions
- Provider-specific `include`, `expand`, or projection parameters

When a request changes, update the exact request assertion in the same change as
the parser and fixture. Keep the request minimal and request only fields the
adapter uses.

## Parsing Rules

Parse provider response data at the adapter boundary so the rest of the
application receives the shared types rather than provider-specific shapes.

- Normalize timestamps to ISO 8601 strings before returning a `CIBuild`.
- Convert epoch milliseconds with `new Date(value)`.
- Convert epoch seconds with `new Date(value * 1000)`.
- Normalize non-standard date formats explicitly and validate the result.
- Preserve missing, null, queued, and unstarted values as `undefined`.
- Do not use provider-relative display strings as stored data; they become stale.
- Do not infer a build timestamp from the time BuildReactor polled the service.
- Keep existing error-return behavior intact.

Use optional fields when provider responses legitimately omit data. A no-run,
queued, or unsupported build must not receive fabricated status, timestamp, or URL
values.

## Fixtures And Tests

Update the response fixture and parsed-result assertions together. Add or update
coverage for the behavior affected by the change, including where applicable:

- Successful completed responses
- Running responses
- Queued or scheduled responses
- Empty responses and no-run workflows
- Missing or malformed optional fields
- Authentication, network, or provider error responses

Keep fixture identities, repository names, URLs, tokens, and user names generic
and anonymized. Never call a real CI service from automated tests.

Use Vitest for adapter request and parsing behavior. Use Playwright only for an
integrated extension flow that needs browser APIs, extension storage, or rendered
UI. Follow the testing skill for extension build and storage requirements.

## Verification

Run the focused adapter test first, then the repository checks:

```bash
npx vitest run src/services/<service>/<service>.test.ts
npm test
npm run lint
npm run typecheck
git diff --check
```

If the change affects built-extension behavior, also run `npm run dist` before the
focused Playwright test. Do not commit changes unless explicitly requested.
