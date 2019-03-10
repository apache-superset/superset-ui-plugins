import { LineBarChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-nvd3';
import Stories from './Stories';

new LineBarChartPlugin().configure({ key: 'line_bar' }).register();

export default {
  examples: [...Stories],
};
