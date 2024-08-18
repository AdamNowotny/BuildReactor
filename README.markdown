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
2. Go to project directory and run:

-   `npm install`
-   `npm run dist`

3. Open Chrome Extension manager and `Load unpacked extension..` from `dist/BuildReactor` folder.

## Testing

`npm test` - run unit tests

`npm run test:watch` - use during development to run tests continuously

`npm run dev` - opens web server at `http://localhost:5137/` for popup and dashboard testing.

**Note** - Use `core.init({ test: true })` to get mocked responses as service worker is not available. Without it the pages will fail to load in Vite web server.

## Contribute

[Adding new service](docs/new-service.markdown)

[Adding new dashboard](docs/new-dashboard.markdown)

# Legal

This code is distributed under Apache License version 2.0

Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg
