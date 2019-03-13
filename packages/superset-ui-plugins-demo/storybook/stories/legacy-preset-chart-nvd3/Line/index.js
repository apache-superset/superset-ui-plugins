import { LineChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-nvd3/src';
import Stories from './Stories';

new LineChartPlugin().configure({ key: 'line' }).register();

export default {
  examples: [...Stories],
};
