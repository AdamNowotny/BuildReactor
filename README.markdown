# BuildReactor [![.github/workflows/build.yml](https://github.com/AdamNowotny/BuildReactor/actions/workflows/build.yml/badge.svg)](https://github.com/AdamNowotny/BuildReactor/actions/workflows/build.yml)

Developer notifications and dashboard for CI servers

-   Gives you overview of all your builds in one place
-   Supports multiple continuous integration servers
-   Configurable notifications
-   Fullscreen mode let's you setup information radiator for your team within minutes
-   Works on Windows, Mac and Linux

## Links

[Chrome Web Store](https://chrome.google.com/webstore/detail/buildreactor/agfdekbncfakhgofmaacjfkpbhjhpjmp)

[Mozilla Add-ons](https://addons.mozilla.org/en-GB/firefox/addon/buildreactor-extension/)

# Supported services

Below are the supported CI servers.

-   Servers using [XML cctray format](https://github.com/robertmaldon/cc_dashboard/blob/master/README.md#multiple-project-summary-reporting-standard)
-   [Atlassian Bamboo](http://www.atlassian.com/software/bamboo/)
-   [BuildBot](http://buildbot.net/)
-   [BuildKite](https://buildkite.com/)
-   [GitHub Actions](https://github.com/features/actions)
-   [Jenkins](http://jenkins.io/)
-   [TeamCity](http://www.jetbrains.com/teamcity/)
-   [Travis-CI](http://travis-ci.org/)

# Screenshots

## Notifications

<img src="docs/notifications-640x400.png" alt="BuildReactor notifications">

## Popup and chrome badge

<img src="docs/popup-640x400.png" alt="BuildReactor popup">

## Options page - adding new service

<img src="docs/settings-new-1280x800.png" alt="BuildReactor options page">

## Options page - service settings

<img src="docs/settings-1280x800.png" alt="BuildReactor options page">

## Options page - view configuration

<img src="docs/settings-view-1280x800.png" alt="BuildReactor view configuration page">

## Dashboard page

<img src="docs/dashboard-1280x800.png" alt="BuildReactor dashboard">

# Developer setup

It's recommneded to use VSCode with DevContainers extension (https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

This will open project with all needed dependencies.

## Installation (manual)

1. Install [Node.js](http://nodejs.org/)
2. Install all VSCode extensions listed in `.devcontainer/devcontainer.json`.

## Build

Go to project directory and run:

-   `npm install`
-   `npm run dist`

3. Open Chrome Extension manager and `Load unpacked extension..` from `dist/build` folder.

## Development

`npm test` - run unit tests

`npm run test:watch` - use during development to run tests continuously

`npm run dev` - opens web server at `http://localhost:5137/` and also allows adding extension in Chrome pointing at `dist/` folder. Hot module Replacement is on. You need to later use `npm run dist` to build a package that does not require a running server.

`npm run dev:mock` - runs webserver at `http://localhost:5137/` for testing with mocked responses from service worker. useful to run browser inside VS for quick feedback.

## Debugging

All processing in BuildReactor happens in the background script (service worker). The dashboard, popup, and options pages are just UI shells that communicate with the background script. This means web console logs from the pages won't show useful debugging information - you need to inspect the background script directly.

### Firefox
1. Open `about:addons`
2. Click the gear icon next to "Manage Your Extensions"
3. Select "Debug Add-ons"
4. Find BuildReactor and click "Inspect" to open the debugger
5. Check the **Console** tab for logs from the background script
6. Check the **Network** tab to see API requests/responses

### Chrome
1. Open `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Find BuildReactor and click "Service worker" link
4. Check the **Console** tab for logs
5. Check the **Network** tab to see API requests/responses

## Contribute

[Adding new service](docs/new-service.markdown)

[Adding new dashboard](docs/new-dashboard.markdown)

# Legal

This code is distributed under Apache License version 2.0

Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg
