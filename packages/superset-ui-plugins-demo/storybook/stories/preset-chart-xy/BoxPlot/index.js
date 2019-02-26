import { BoxPlotChartPlugin as LegacyBoxPlotChartPlugin } from '../../../../../superset-ui-preset-chart-xy/src/legacy';
import { BoxPlotChartPlugin } from '../../../../../superset-ui-preset-chart-xy/src';
import Stories from './Stories';

new LegacyBoxPlotChartPlugin().configure({ key: 'v2-box-plot/legacy' }).register();
new BoxPlotChartPlugin().configure({ key: 'v2-box-plot' }).register();

export default {
  examples: [...Stories],
};
