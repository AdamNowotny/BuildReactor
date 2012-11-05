BuildReactor [![Build Status](https://secure.travis-ci.org/AdamNowotny/BuildReactor.png)](http://travis-ci.org/AdamNowotny/BuildReactor)
============

Notifications for CI servers events (Google Chrome extension)

Download from [Chrome Web Store](http://goo.gl/BX01T)

Twitter [@BuildReactor](https://twitter.com/BuildReactor)

What does it do ?
=================

 * Monitors multiple continuous integration servers
 * Gives you overview of all your builds in one place
 * Shows notifications only about the important events to minimise distractions
 * Works on Windows, Mac and Linux
 * Designed with distributed teams and road warriors in mind

Why do I need it ?
==================

 * The team you just joined uses a different server for continuous integration. `cctray` or similar might work for you or might not depending what server you want to connect to.
 * Do you like being spammed about every single commit to the repository or that the server is "building"...again ? On teams using continous delivery this happens all the time.
 * Some servers send you notifications about broken builds on your email. Try going away on vacation or even for lunch and tell me how useful all these messages were when you came back.
 * Your team uses an information radiator or a build light, but you might not see it all the time or would like to have more information before interrupting your work.
 * If you work remotely, how do you know it's safe to get latest changes from the repository or push your changes ? Refreshing the page and looking for relevant information until your build passes seems like a boring way to spend your time.

How does it work ?
==================

 * See the state of all builds by clicking BuildReactor icon in chrome
 * Click on notification opens page that gives you more details about this event
 * Notifications about events that require some action (f.e. build broken) stay on screen
 * Notifications about fixed builds show up briefly to let you know the build is reliable again and it's safe to get latest sources or commit your changes
 * Outdated notifications are hidden, f.e. build failure if someone already fixed the build. That way you don't end up with crazy amount of notifications after being away. You only see how things changed since the last time you looked at the screen.

Supported services
==================

Below are the supported CI servers and example urls for public instances if available.

 * Atlassian Bamboo - https://ci.openmrs.org/
 * CruiseControl
 * CruiseControl.NET - http://build.nauck-it.de/
 * CruiseControl.rb - http://cruisecontrolrb.thoughtworks.com/
 * Jenkins (Hudson) - http://ci.jenkins-ci.org/
 * ThoughtWorks GO
 * TeamCity 7+ - http://teamcity.jetbrains.com/
 * Generic cctray XML (Travis-CI)

CCtray
------

Most CI servers report the status of the builds using cctray [XML reporting format](http://confluence.public.thoughtworks.org/display/CI/Multiple+Project+Summary+Reporting+Standard), you just need to add the location of the XML to the address of your server.

For example if you want to monitor a Travis-CI build, use this format:

http://travis-ci.org/AdamNowotny/BuildReactor/cc.xml

Screenshots
===========

Notifications
-------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/notifications-640x400.jpg" alt="BuildReactor notifications">

Popup and chrome badge
----------------------
The number in the badge shows how many builds are currently broken. 

<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/popup.jpg" alt="BuildReactor action icon">

Options page - adding new service
---------------------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings-new-1280x800.jpg" alt="BuildReactor options page">

Options page - service settings
-------------------------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings-1280x800.jpg" alt="BuildReactor options page">

Developer setup
===============

[Node.js](http://nodejs.org/) is required to build the extension. After it's installed go to project directory and run:

```
npm install
./node_modules/.bin/grunt
```

Open Chrome Extension manager and "Load unpacked extension.." from `_build/BuildReactor` folder.

Running `grunt` and refreshing the extension in Chrome is required every time you make a change. If the build fails and you just want to deploy:
```
grunt dist
```

Technical overview
==================

The packaged version uses:
 * [Require-JS](http://requirejs.org/)
 * [JS-Signals](http://millermedeiros.github.com/js-signals/)
 * [amd-utils](http://millermedeiros.github.com/amd-utils/)
 * [jQuery](http://jquery.com/)
 * [jQuery Tools](http://jquerytools.org/)
 * [Twitter bootstrap](http://twitter.github.com/bootstrap/)
 * [Handlebars](http://handlebarsjs.com/) templates through [require-handlebars-plugin](https://github.com/SlexAxton/require-handlebars-plugin)
 * [URL.js](https://github.com/ericf/urljs)

The build and tests use:
 * [node.js](http://nodejs.org/)
 * [jasmine](http://pivotal.github.com/jasmine/)
 * [jasmine-jquery](https://github.com/velesin/jasmine-jquery/)
 * [jasmine-signals](https://github.com/AdamNowotny/jasmine-signals)
 * [grunt](http://gruntjs.com/)
 * [grunt-contrib](https://github.com/gruntjs/grunt-contrib)
 * [grunt-jasmine-task](https://github.com/creynders/grunt-jasmine-task)
 * [PhantomJS](http://phantomjs.org/)
 * [Travis-CI](http://travis-ci.org/)
 * [has.js](https://github.com/phiggins42/has.js) (for debug build)
 * [RequireJS plugins](https://github.com/millermedeiros/requirejs-plugins)

Legal
=====

This code is distributed under Apache License version 2.0

Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg

Tool icon taken from http://www.iconspedia.com/icon/metro-tools-black-18254.html

What's new
============
Version history can be found [here](https://github.com/AdamNowotny/BuildReactor/wiki/What's-new)

Follow [@BuildReactor](https://twitter.com/BuildReactor) on Twitter to find out what's in new releases.