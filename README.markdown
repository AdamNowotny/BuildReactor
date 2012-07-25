BuildReactor
============
`BuildReactor` is a Google Chrome extension that shows notifications for CI server events.

<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/notifications.png" alt="BuildReactor notifications">

So far Atlassian Bamboo and CruiseControl are supported.

After installing the extension go to options page and enter the URL for Bamboo instance and username and password if required.

<img src="https://github.com/AdamNowotny/BuildReactor/raw/master/docs/settings.png" alt="BuildReactor options page">

Installation
============
Node required to build the extension.

```
npm install grunt grunt-contrib grunt-jasmine-task
node_modules/.bin/grunt
```

Point Chrome to build/BuildReactor folder.

Attribution
===========
Application icon based on https://commons.wikimedia.org/wiki/File:Radiation_warning_symbol_3.svg

What's new
============
0.2.0 (8/04/2012)
Lots of UI improvements, using Twitter bootstrap

0.1.0 (23/12/2011)
First version with Bamboo support