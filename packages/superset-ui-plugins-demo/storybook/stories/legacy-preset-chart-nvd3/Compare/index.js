import { CompareChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-nvd3';
import 'nvd3/build/nv.d3.min.css';
import '../../../../../superset-ui-legacy-preset-chart-nvd3/lib/style.css';
import Stories from './Stories';

new CompareChartPlugin().configure({ key: 'compare' }).register();

export default {
  examples: [...Stories],
};
