# Adding new dashboard theme

Visualizations are added to [dashboard/themes/](../src/dashboard/themes/)

Create a new React component that will receive `{ popup: boolean }` when called.

In a simple case you can just modify the CSS styles and still use `Pipelines` components to show the builds.

## React Context

Use React context to get:

-   [viewConfig](../src/common/types.ts#L88) - view configuration as shown on _View_ tab in settings
-   [serviceState](../src/common/types.ts#L80) array - current state of monitored services and pipelines

Example code:

```js
import { ServiceStateContext, ViewConfigContext, ThemeProps } from 'dashboard/types';

export default ({ popup }: ThemeProps) => {
    const viewConfig = useContext(ViewConfigContext);
    const serviceStates = useContext(ServiceStateContext);
    return (
        <div>Columns: {viewConfig.columns}</div>
        <div>Service count: {serviceStates.length}</div>
    )
}
```

## Registration

After implementing the React component you need to register the theme in [dashboard/components/themeProvider](../src/dashboard/components/theme/themeProvider.tsx#L8).

To be able to select the new theme, the next step is to add it to [theme selection options](../src/settings/view/view.html#L4-L22)

**Note**: The settings page still uses Angular 1 framework and is not compiled with Vite. Run `npm run dist` and load extension to see changes.
