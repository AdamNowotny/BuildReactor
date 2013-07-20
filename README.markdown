BuildReactor [![Build Status](https://secure.travis-ci.org/AdamNowotny/BuildReactor.png)](http://travis-ci.org/AdamNowotny/BuildReactor) [![Dependency Status](https://gemnasium.com/AdamNowotny/BuildReactor.png)](https://gemnasium.com/AdamNowotny/BuildReactor)
============

Developer notifications and dashboard (Google Chrome extension)
 * Gives you overview of all your builds in one place
 * Supports all continuous integration servers
 * Shows only relevant notifications to minimise distractions
 * Let's you setup information radiator for your team within minutes, not hours or days
 * Works on Windows, Mac and Linux

Links
-----
Install from [Chrome Web Store](http://goo.gl/BX01T)

Updates on [Twitter](https://twitter.com/BuildReactor) and [Google Plus](https://plus.google.com/110744393630490320507/)

[Version history](https://github.com/AdamNowotny/BuildReactor/wiki/What's-new)

Supported services
==================

Below are the supported CI servers.

 * [Atlassian Bamboo](http://www.atlassian.com/software/bamboo/)
 * [BuildBot](http://buildbot.net/)
 * Servers using [XML cctray format](http://confluence.public.thoughtworks.org/display/CI/Multiple+Project+Summary+Reporting+Standard) like [CruiseControl](http://cruisecontrol.sourceforge.net/), [CruiseControl.NET](http://www.cruisecontrolnet.org/), [CruiseControl.rb](http://cruisecontrolrb.thoughtworks.com/)
 * [Jenkins](http://jenkins-ci.org/) (Hudson)
 * [ThoughtWorks GO](http://www.thoughtworks-studios.com/go-continuous-delivery)
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

Dashboard page
-------------------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/dashboard-1280x800.jpg" alt="BuildReactor dashboard">

Developer setup
===============

[Node.js](http://nodejs.org/) is required to build the extension. After it's installed go to project directory and run:

```
npm install
bower update
grunt
```

Open Chrome Extension manager and `Load unpacked extension..` from `_build/BuildReactor` folder.

Running `grunt` (or just `grunt dist`) and refreshing the extension in Chrome is required every time you make a change.

Technical overview
==================

The packaged version uses:
 * [Font Awesome](http://fortawesome.github.com/Font-Awesome/)
 * [Handlebars](http://handlebarsjs.com/) templates using [require-handlebars-plugin](https://github.com/SlexAxton/require-handlebars-plugin)
 * [JS-Signals](http://millermedeiros.github.com/js-signals/)
 * [jQuery](http://jquery.com/)
 * [mout](http://moutjs.com/)
 * [RxJS](http://reactive-extensions.github.com/RxJS/)
 * [RxJS-jquery](https://github.com/Reactive-Extensions/rxjs-jquery)
 * [Require-JS](http://requirejs.org/)
 * [Twitter bootstrap](http://twitter.github.com/bootstrap/)

The build and tests use:
 * [Bower](http://twitter.github.com/bower/)
 * [grunt](http://gruntjs.com/)
 * [grunt-contrib](https://github.com/gruntjs/grunt-contrib)
 * [grunt-jasmine-runner](https://github.com/jasmine-contrib/grunt-jasmine-runner)
 * [jasmine](http://pivotal.github.com/jasmine/)
 * [jasmine-jquery](https://github.com/velesin/jasmine-jquery/)
 * [jasmine-signals](https://github.com/AdamNowotny/jasmine-signals)
 * [RequireJS plugins](https://github.com/millermedeiros/requirejs-plugins)
 * [Travis-CI](http://travis-ci.org/)

Legal
=====

This code is distributed under Apache License version 2.0

Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg
