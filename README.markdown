BuildReactor [![Build Status](https://secure.travis-ci.org/AdamNowotny/BuildReactor.png)](http://travis-ci.org/AdamNowotny/BuildReactor) [![Dependency Status](https://gemnasium.com/AdamNowotny/BuildReactor.png)](https://gemnasium.com/AdamNowotny/BuildReactor)
============

Developer notifications and dashboard (Google Chrome extension)
 * Gives you overview of all your builds in one place
 * Supports multiple continuous integration servers
 * Shows only relevant notifications to minimise distractions
 * Fullscreen mode let's you setup information radiator for your team within minutes, not hours or days
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
 * Servers using [XML cctray format](http://confluence.public.thoughtworks.org/display/CI/Multiple+Project+Summary+Reporting+Standard) like [CruiseControl](http://cruisecontrol.sourceforge.net/), [CruiseControl.NET](http://www.cruisecontrolnet.org/), [CruiseControl.rb](http://cruisecontrolrb.thoughtworks.com/)
 * [GoCD](https://github.com/gocd/gocd)
 * [Jenkins](http://jenkins-ci.org/) (Hudson)
 * [Snap](http://snap-ci.com/)
 * [TeamCity](http://www.jetbrains.com/teamcity/)
 * [Travis-CI](http://travis-ci.org/)

Screenshots
===========

Notifications
-------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/notifications-640x400.jpg" alt="BuildReactor notifications">

Popup and chrome badge
----------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/popup-640x400.jpg" alt="BuildReactor popup">

Options page - adding new service
---------------------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings-new-1280x800.jpg" alt="BuildReactor options page">

Options page - service settings
-------------------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings-1280x800.jpg" alt="BuildReactor options page">

Options page - view configuration
---------------------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings-view-1280x800.jpg" alt="BuildReactor view configuration page">

Dashboard page
-------------------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/dashboard-1280x800.jpg" alt="BuildReactor dashboard">

Developer setup
===============

Installation
------------

[Node.js](http://nodejs.org/) and [Sass](http://sass-lang.com/install) is required to build the extension. After it's installed go to project directory and run:

```
npm install
node_modules/.bin/bower update
node_modules/.bin/grunt
```

Open Chrome Extension manager and `Load unpacked extension..` from `_build/BuildReactor` folder.

`grunt` - full build

`grunt dist` - create distribution package without running tests

Reloading the extension in Chrome is required every time you make a change.

Testing
-------

`grunt test` - run Karma using Chrome (edit `karma.conf.js` to change) and watch for changes

Once running you can also open `localhost:9876/base/options.html` or any other HTML file in the browser to test using sample data. This does not require you to load as Chrome Extension.

Dependencies
============

The packaged version uses:
 * [AngularJS](angularjs.org)
 * [Font Awesome](http://fortawesome.github.com/Font-Awesome/)
 * [jQuery](http://jquery.com/)
 * [Mout](http://moutjs.com/)
 * [Require-JS](http://requirejs.org/)
 * [RxJS](http://reactive-extensions.github.com/RxJS/)
 * [Twitter bootstrap](http://twitter.github.com/bootstrap/)

The build and tests use:
 * [Bower](http://twitter.github.com/bower/)
 * [Grunt](http://gruntjs.com/)
 * [Plato](https://github.com/jsoverson/plato)
 * [Karma](http://karma-runner.github.io/)
 * [Travis-CI](http://travis-ci.org/)

Legal
=====

This code is distributed under Apache License version 2.0

Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg
