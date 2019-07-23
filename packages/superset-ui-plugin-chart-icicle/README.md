## @superset-ui/plugin-chart-icicle

## WIP

This is a work in progress with the design being finalized.

This plugin provides Icicle Chart for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import IcicleChartPlugin from '@superset-ui/plugin-chart-icicle';

new IcicleChartPlugin()
  .configure({ key: 'icicle' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui-plugins/?selectedKind=plugin-chart-word-cloud) for more details.

```js
<SuperChart
  chartType="icicle"
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

### Current Prototype (Subject to Change)

![Current Prototype](./src/images/thumbnail.png)
