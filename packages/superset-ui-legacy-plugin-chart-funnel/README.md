## @superset-ui/legacy-plugin-chart-funnels

This plugin provides Funnel Diagram for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import FunnelChartPlugin from '@superset-ui/legacy-plugin-chart-funnel';

new ChordChartPlugin()
  .configure({ key: 'funnel' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui-plugins/?selectedKind=plugin-chart-funnel) for more details.

```js
<SuperChart
  chartType="funnel"
  chartProps={{
    width: 600,
    height: 600,
    formData: {...},
    payload: {
      data: {...},
    },
  }}
/>
```
