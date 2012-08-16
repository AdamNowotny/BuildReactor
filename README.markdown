BuildReactor
============
`BuildReactor` is a Google Chrome extension that shows notifications for CI server events.[![Build Status](https://secure.travis-ci.org/AdamNowotny/BuildReactor.png)](http://travis-ci.org/AdamNowotny/BuildReactor)

<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/notifications.png" alt="BuildReactor notifications">

So far Atlassian Bamboo and CruiseControl are supported.

After installing the extension go to options page and enter the URL for Bamboo instance and username and password if required.

<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings.png" alt="BuildReactor options page">

Developer installation
============
[Node.js](http://nodejs.org/) is required to build the extension. After it's installed go to project directory and run:

```
npm install
./node_modules/.bin/grunt
```

Open Chrome Extension manager and "Load unpacked extension.." from "_build/BuildReactor" folder.

Attribution
===========
Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg

What's new
============

0.3.0 (16/08/2012)
 * First public version
 * Support for cctray XML reporting format
 * Automated build
 * Switched to Chrome extensions manifest version 2

0.2.0 (8/04/2012)
 * Lots of UI improvements, using Twitter bootstrap

0.1.0 (23/12/2011)
 * First version with Bamboo support