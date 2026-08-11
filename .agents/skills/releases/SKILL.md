---
name: releases
description: Use when preparing, reviewing, or publishing a BuildReactor versioned GitHub release and extension artifacts.
---

# BuildReactor Releases

## Release Sequence

1. Inspect the commits since the previous version tag and write concise notes
   grouped under `Features`, `Bug Fixes`, and `Development`.
2. Update the exact version in `package.json`. Never edit `package-lock.json`
   manually; regenerate it with `npm install --package-lock-only`.
3. Run `npm test`, `npm run typecheck`, and `git diff --check`.
4. Commit the version bump before creating the tag.
5. Create the GitHub release as a draft with `gh release create`.
6. Push the version-bump commit to `main`.
7. Create the matching `v<version>` tag. A draft release may be represented as
   untagged by GitHub, so creating the draft alone does not trigger the tag
   workflow. Use `gh api` to create the tag ref after the commit is remote.
8. Monitor the `Build and Release` workflow with `gh run list` or `gh run watch`.
9. Confirm the draft contains both versioned ZIP assets before publishing.

Do not publish the GitHub release, submit store packages, or change store
listing state until the draft notes, tag, workflow result, and assets have been
reviewed.

## Release Workflow

`.github/workflows/release.yml` runs for tags matching `v*`. It:

- Installs dependencies and runs `npm test`.
- Builds Chrome with `npm run dist`.
- Builds Firefox with `npm run dist:firefox`.
- Uploads `build-reactor-chrome-v<version>.zip` and
  `build-reactor-firefox-v<version>.zip` to the matching GitHub release.
- Uploads the Chrome ZIP to the Chrome Web Store without publishing it.

The package version must match the tag. Otherwise, the workflow uploads assets
with the wrong version in their names.

## Publishing Requirements

Publishing the GitHub draft is separate from publishing to extension stores:

- Publish the reviewed GitHub release with `gh release edit v<version> --draft=false`.
- Chrome is uploaded by `release.yml` after a successful tag build, but is not
  published automatically. Required secrets are `CHROME_EXTENSION_ID`,
  `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, and `CHROME_REFRESH_TOKEN`.
  Manually dispatch `publish-chrome.yml` with `release_tag=v<version>`, then
  review and publish the package in the Chrome Web Store developer console.
- Manually dispatch `publish-firefox.yml` with `release_tag=v<version>`. The
  workflow submits the ZIP to Firefox Add-ons for review. Required secrets are
  `FIREFOX_EXTENSION_GUID`, `FIREFOX_JWT_ISSUER`, and `FIREFOX_JWT_SECRET`.

The store workflows default to the latest release when `release_tag` is empty;
always provide the explicit tag for a new release.

## Useful Commands

```bash
gh release create v<version> --draft --target main --title "v<version>" --notes-file <notes-file>
gh release edit v<version> --draft=false
gh release view v<version> --json isDraft,tagName,assets,url
gh api repos/AdamNowotny/BuildReactor/git/refs \
    -f ref='refs/tags/v<version>' \
    -f sha='<remote commit SHA>'
gh run list --workflow release.yml --limit 5
gh run watch <run-id>
gh workflow run publish-chrome.yml -f release_tag=v<version>
gh workflow run publish-firefox.yml -f release_tag=v<version>
```

Before finishing, verify the worktree, release state, tag, workflow result, and
asset names. Never delete or overwrite an existing release or tag without
explicit approval.
