BuildReactor [![Build Status](https://secure.travis-ci.org/AdamNowotny/BuildReactor.png)](http://travis-ci.org/AdamNowotny/BuildReactor) [![Dependency Status](https://gemnasium.com/AdamNowotny/BuildReactor.png)](https://gemnasium.com/AdamNowotny/BuildReactor)
============

Developer notifications and dashboard (Google Chrome extension)
 * Gives you overview of all your builds in one place
 * Supports multiple continuous integration servers
 * Configurable notifications
 * Fullscreen mode let's you setup information radiator for your team within minutes
 * Works on Windows, Mac and Linux

Links
-----
[Chrome Web Store](http://goo.gl/BX01T) - latest stable version

[Twitter](https://twitter.com/BuildReactor)

[Google Plus](https://plus.google.com/110744393630490320507/)

Supported services
==================

Below are the supported CI servers.

 * [Atlassian Bamboo](http://www.atlassian.com/software/bamboo/)
 * [BuildBot](http://buildbot.net/)
 * [CircleCI](https://circleci.com) (using cctray format)
 * Servers using [XML cctray format](http://confluence.public.thoughtworks.org/display/CI/Multiple+Project+Summary+Reporting+Standard) like [CruiseControl](http://cruisecontrol.sourceforge.net/), [CruiseControl.NET](http://www.cruisecontrolnet.org/), [CruiseControl.rb](http://cruisecontrolrb.thoughtworks.com/)
 * [GoCD](https://github.com/gocd/gocd)
 * [Jenkins](http://jenkins-ci.org/) (Hudson)
 * [Snap](http://snap-ci.com/)
 * [Solano CI](https://www.solanolabs.com/) (using cctray format)
 * [TeamCity](http://www.jetbrains.com/teamcity/)
 * [Travis-CI](http://travis-ci.org/)

Screenshots
===========

Notifications
-------------
<img src="docs/notifications-640x400.jpg" alt="BuildReactor notifications">

Popup and chrome badge
----------------------
<img src="docs/popup-640x400.jpg" alt="BuildReactor popup">

Options page - adding new service
---------------------------------
<img src="docs/settings-new-1280x800.jpg" alt="BuildReactor options page">

Options page - service settings
-------------------------------
<img src="docs/settings-1280x800.jpg" alt="BuildReactor options page">

Options page - view configuration
---------------------------------
<img src="docs/settings-view-1280x800.jpg" alt="BuildReactor view configuration page">

Dashboard page
-------------------------------
<img src="docs/dashboard-1280x800.jpg" alt="BuildReactor dashboard">

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
`yarn run auto-test` test and watch for changes

Development
-----------

[Adding new services](docs/adding-new-services.markdown)

Legal
=====

This code is distributed under Apache License version 2.0

Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg
