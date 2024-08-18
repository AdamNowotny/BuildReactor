# Adding new services

To add support for a new type of service in BuildReactor you need to implement three methods described below and register the service.

You can look up all the TypeScript types involved here:
https://github.com/AdamNowotny/BuildReactor/blob/master/src/common/types.ts#L71-L78

For examples look at implementations in the services folder:

-   [BuildKite](../src/services/buildkite/buildkite.ts)
-   [GitHub Actions](../src/services/github/github.ts)
-   [Jenkins](../src/services/jenkins/jenkins.ts)

## Configuration

The `getDefinition` method is called to get information about the new service type, for example available settings, icons, etc. At a minimum this needs to be implemented so the service can be registered and shown on the **New service** page.

Example:

```js
const getDefinition = () => ({
    typeName: 'My Service', // name shown when adding service
    baseUrl: 'my-service', // service ID, same as the folder name file is in
    icon: 'services/my-service/icon.png', // icon for browser notifications, /src/ is the base folder
    logo: 'services/my-service/logo.svg', // Logo shown when adding new service
    defaultConfig: {
        baseUrl: 'my-service',
        name: '',
        pipelines: [],
        token: ''
    }
    fields: [
        {
            type: 'url', // available types: url, token, username, password, branch
            name: 'Server URL', // label displayed above the field (optional)
            config: 'url', // configuration property used to store the value (optional)
            help: 'Help text for url' // additional field description (optional)
        },
        { type: 'token' }
    ]
});
```

`defaultConfig` contains the initial configuration that is applied when new service instace is added.

Both `baseUrl` fields are required and should be the same as folder name in _/services/_ where you created your implementation.

`fields` specifies which UI elements will be available when configuring service instance. It is an optional list as by default the form uses the properties of the `defaultConfig` object to determine which fields should be shown. For details refer to [dynamicForm.html](../src/settings/service/directives/dynamicForm/dynamicForm.html)

## List of available pipelines

Called when user presses _Show_ on the configuration page. Should return a promise resolving to list of `CIPipeline` items.

Example (hard-coded values):

```js
const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    return [
        {
            id: 'build_id', // unique ID, this will be passed to getLatestBuilds
            name: 'Build name', // name shown in the UI
            group: 'Group', // optional group the pipeline belongs to
            isDisabled: false, // optional, some servers report projects as not buildable/disabled
        },
    ];
};
```

## Latest status

`getLatestBuilds` function accepts service settings with array of pipeline IDs to monitor.

The example below uses [/src/service-worker/request.ts](../src/service-worker/request.ts) to make HTTP request for each build in `settings.pipelines` array and then parse the body of each response. `Request` is a wrapper around Fetch API that handles some common HTTP headers, parsing of XML and makes it easier to unit test against saved json responses.

Example:

```js
const getLatestBuilds = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.debug('service.getLatestBuilds', settings);
    const pipelines = settings.pipelines.map(async (id: string): Promise<CIBuild> => {
            try {
                const response = await request.get(
                    { url: `https://server/builds/${id}.json` }
                );
                const [build] = response.body.builds; // get first build item
                if (!build) throw new Error('Build not found');
                return parseBuild(build);
            } catch (ex: any) {
                return {
                    id: id,
                    name: id,
                    error: { name: 'Error', message: ex.message },
                };
            }
        },
    );
    return await Promise.all(pipelines);
};

const parseBuild = (build: any): CIBuild => {
    return {
        id: build.id, // required
        name: build.name,
        group: build.group,
        webUrl: build.url, // clicking on the build will open the url
        isBroken: build.state === 'failed', // shown as red if true
        isRunning: build.active, // in progress, shown as animated stripes
        isWaiting: build.queued, // scheduled, shown as stripes with no animation
        isDisabled: false, // tag as disabled and display as grey
        tags: [{ name: 'Canceled', type: 'warning' }], // other tags, type is optional (warning displayed yellow)
        changes: (build.commits ?? []).map(commit => ({
            name: commit.username,
            message: commit.message,
        })), // commit messages and committer name
    }
};
```

The only required fields are `id` and `name` however you want to implement as least `webUrl`, `isBroken` and `isRunning` to see the status of the build.

The _catch_ clause returns a build with `error` object. This is so only a single build is marked as _offline_ instead of the whole list in case the request or parsing throws an exception.

## Registration

After implementing the 3 functions you need to register the service to make it available. This is done in [/src/services/service-repository.ts](../src/services/service-repository.ts).

Import the file:

```js
import myService from 'services/my-service/my-service';
```

then add your service implementing `CIService` to the `services` array in `init` method.
