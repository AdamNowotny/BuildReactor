BuildReactor [![pipeline status](https://gitlab.com/adam.nowotny/BuildReactor/badges/master/pipeline.svg)](https://gitlab.com/adam.nowotny/BuildReactor/-/commits/master)
============

Developer notifications and dashboard for CI servers
 * Gives you overview of all your builds in one place
 * Supports multiple continuous integration servers
 * Configurable notifications
 * Fullscreen mode let's you setup information radiator for your team within minutes
 * Works on Windows, Mac and Linux

Links
-----
[Chrome Web Store](https://chrome.google.com/webstore/detail/buildreactor/agfdekbncfakhgofmaacjfkpbhjhpjmp)

[Mozilla Add-ons](https://addons.mozilla.org/en-GB/firefox/addon/buildreactor-extension/)

[Twitter](https://twitter.com/BuildReactor)

[Google Plus](https://plus.google.com/110744393630490320507/)

Supported services
==================

Below are the supported CI servers.

 * Servers using [XML cctray format](https://github.com/robertmaldon/cc_dashboard/blob/master/README.md#multiple-project-summary-reporting-standard)
 * [Atlassian Bamboo](http://www.atlassian.com/software/bamboo/)
 * [BuildBot](http://buildbot.net/)
 * [BuildKite](https://buildkite.com/)
 * [Jenkins](http://jenkins.io/)
 * [TeamCity](http://www.jetbrains.com/teamcity/)
 * [Travis-CI](http://travis-ci.org/)

Screenshots
===========

Notifications
-------------
<img src="docs/notifications-640x400.png" alt="BuildReactor notifications">

Popup and chrome badge
----------------------
<img src="docs/popup-640x400.png" alt="BuildReactor popup">

Options page - adding new service
---------------------------------
<img src="docs/settings-new-1280x800.png" alt="BuildReactor options page">

Options page - service settings
-------------------------------
<img src="docs/settings-1280x800.png" alt="BuildReactor options page">

Options page - view configuration
---------------------------------
<img src="docs/settings-view-1280x800.png" alt="BuildReactor view configuration page">

Dashboard page
-------------------------------
<img src="docs/dashboard-1280x800.png" alt="BuildReactor dashboard">

Developer setup
===============

Installation
------------

1. Install [Node.js](http://nodejs.org/) to build the extension or use docker image:
 - `docker-compose run build-reactor`
3. Go to project directory and run:
 - `yarn`
 - `yarn run dist`
4. Open Chrome Extension manager and `Load unpacked extension..` from `dist/BuildReactor` folder.

Use `yarn run auto-dist` to continually build whenever some file changes. You will still need to reload the extension in Chrome.

See other scripts useful for development in [package.json](package.json).

Testing
-------

`yarn test` - run Karma unit tests using PhantomJS

`yarn run auto-test` - test and watch for changes

Development
-----------

[Adding new services](docs/adding-new-services.markdown)

Legal
=====

This code is distributed under Apache License version 2.0

Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg
