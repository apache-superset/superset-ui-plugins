import { DualLineChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-nvd3';
import Stories from './Stories';
import 'nvd3/build/nv.d3.min.css';
import '../../../../../superset-ui-legacy-preset-chart-nvd3/lib/style.css';

new DualLineChartPlugin().configure({ key: 'dual-line' }).register();

export default {
  examples: [...Stories],
};
