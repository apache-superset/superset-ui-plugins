## @superset-ui/legacy-plugin-grouped_column_line_chart

[![David (path)](https://img.shields.io/david/apache-superset/superset-ui-plugins.svg?path=packages%2Fsuperset-ui-legacy-plugin-chart-table&style=flat-square)](https://david-dm.org/apache-superset/superset-ui-plugins?path=packages/superset-ui-legacy-plugin-chart-table)

This plugin provides Grouped Column Line Chart for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import TableChartPlugin from '@superset-ui/legacy-plugin-grouped-column-line-chart';

new TableChartPlugin()
  .configure({ key: 'grouped_column_line_chart' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui-plugins/) for more details.

```js
<SuperChart
  chartType="grouped_column_line_chart"
  width={600}
  height={600}
  formData={...}
  queryData={{
    data: {...},
  }}
/>
```