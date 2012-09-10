BuildReactor
============

`BuildReactor` is a Google Chrome extension that shows notifications for CI server events.[![Build Status](https://secure.travis-ci.org/AdamNowotny/BuildReactor.png)](http://travis-ci.org/AdamNowotny/BuildReactor)

The idea is to show only the relevant events and minimise distractions. That is why:
 * not all builds are shown, only if they fail or are fixed
 * click on notification opens the page with build results
 * notifications about broken builds stay on screen to let you know the build needs your attention
 * fixed builds dissapear automatically and hide all previous messages about that particular build (so you are presented only with the builds that broke while you were away and are still broken)

You can **install the latest stable version** of the extension from [Chrome Web Store](http://goo.gl/BX01T)

Supported services
==================

Below are the supported services and example urls for public instances if available.

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

Most CI servers report the status of the builds using cctray XML reporting format, you just need to add the location of the XML to the address of your server.

For example if you want to monitor a Travis-CI build, use this format:

http://travis-ci.org/AdamNowotny/BuildReactor/cc.xml

Screenshots
===========

Notifications
-------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/notifications-640x400.jpg" alt="BuildReactor notifications">

Options page
------------
Settings page (Bamboo):
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings-1280x800.jpg" alt="BuildReactor options page">

Adding new service:
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings-new-1280x800.jpg" alt="BuildReactor options page">

Chrome badge
------------
<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/chrome-failed.jpg" alt="BuildReactor action icon">

The number in the badge shows how many builds are currently broken. 

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

What's new
============

Version history can be found [here](https://github.com/AdamNowotny/BuildReactor/wiki/What's-new)