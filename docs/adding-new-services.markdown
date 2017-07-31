Adding new services
===================
To add support for a new type of service in BuildReactor you need to implement three methods described below and register the service.

For examples look at implementations in the services folder:
- [Bamboo](../src/services/bamboo/bamboo.js)
- [BuildKite](../src/services/buildkite/buildkite.js)
- [Jenkins](../src/services/jenkins/jenkins.js)
- [Travis](../src/services/travis/travis.js)

Configuration
-------------
The `getInfo` method is called to get information about the new service type, for example available settings, icons, etc. At a minimum this needs to be implemented so the service can be registered and shown on the __New service__ page.

Example:
```js
const getInfo = () => ({
    typeName: 'My Service', // name shown when adding service
    baseUrl: 'my-service', // service ID, same as the folder name file is in
    icon: 'services/my-service/icon.png', // icon for browser notifications, /src/ is the base folder
    logo: 'services/my-service/logo.svg', // Logo shown when adding new service
    defaultConfig: {
        baseUrl: 'my-service',
        name: '',
        projects: [],
        token: '',
        updateInterval: 60
    }
    fields: [ // optional
        {
            type: 'url', // available types: url, token, username, password
            name: 'Server URL', // label displayed above the field (optional)
            config: 'url', // configuration property used to store the value (optional)
            help: 'Help text for url' // additional field description (optional)
        },
        { type: 'username' },
        { type: 'password' }
    ]
});
```

`defaultConfig` contains the initial configuration that is applied when new service instace is added.

Both `baseUrl` fields are required and should be the same as folder name in _/services/_ where you created your implementation.

`fields` specifies which UI elements will be available when configuring service instance. It is optional as by default the form uses the properties of the `defaultConfig` object to determine which fields should be shown. For details refer to [dynamicForm.html](../src/settings/service/directives/dynamicForm/dynamicForm.html)

List of available builds
------------------------

Called when user presses *Show* on the configuration page. Should return a RxJS sequence with all available builds.

Example (hard-coded values):
```js
const getAll = (settings) => Rx.Observable.fromArray([{
    id: 'build_id', // unique ID, this will be passed to getLatest
    name: 'Build name', // name shown in the UI
    group: 'Group', // null or group the build belongs to if your CI server supports it
    isDisabled: false // some servers report projects as not buildable/disabled
}]);
```
The order of builds in the sequence is not important as they will be ordered according to `settings.projects`.

Latest status
-------------

`getLatest` function accepts service settings with array of build IDs to monitor.

The example below uses [/src/services/jsonRequest.js](../src/services/jsonRequest.js) to make HTTP request for each build in `settings.projects` array and then parse the body of each response.

Example:
```js
const getLatest = (settings) => Rx.Observable.fromArray(settings.projects)
    .selectMany((id) => request
        .get({ url: `https://server/builds/${id}.json` })
        .select((response) => response.body)
        .select((build) => ({
            id: build.id, // required
            name: build.name,
            group: build.group,
            webUrl: build.url, // clicking on the build will open the url
            isBroken: build.state === 'failed', // shown as red if true
            isRunning: build.active, // in progress, shown as animated stripes
            isWaiting: build.queued, // scheduled, shown as stripes with no animation
            isDisabled: false, // tag as disabled and display as grey
            tags: [{ name: 'Canceled', type: 'warning' }], // other tags, type is optional (warning displayed yellow)
            changes: (build.commits || []).map((commit) => ({
                name: commit.username,
                message: commit.message
            })) // commit messages and committer name, likely to contain only one element
        }))
        .catch((ex) => Rx.Observable.return({
            id,
            error: ex
        }))
    );
```

The only required field is `id` however you want to implement as least `webUrl`, `isBroken` and `isRunning` to see the status of the build.

The _catch_ clause returns a build with `error` object. If the request or parsing fails then the `message` field from the error will be shown and the build will be tagged as *Offline*. The block is required so only the currently processed build is marked as error, otherwise if the whole sequence fails then all builds will be considered not accessible.

Existing implementations extract all available requests to a separate file to make unit testing easier. All protocol level concerns can be handled there (constructing the url, paging, authorisation, etc.).

Registration
------------

After implementing the 3 functions you need to register the service to make it available. This is done in [/src/core/main.js](../src/core/main.js).

Import the file:
```js
import myService from 'services/my-service/my-service';
```

then create a new instance of service using `poolingService`. This wraps your service to add error handling, call `getLatest` at regular intervals and push `serviceUpdated` event which is used by other parts of the extension to process the current build state.

The class created by `poolingService` has to be registered with `serviceController` to be available.

```js
serviceController.registerType(poolingService.create(myService));
```
