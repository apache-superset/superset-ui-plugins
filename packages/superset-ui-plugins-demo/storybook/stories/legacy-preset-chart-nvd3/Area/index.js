import { AreaChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-nvd3';
import 'nvd3/build/nv.d3.min.css';
import '../../../../../superset-ui-legacy-preset-chart-nvd3/lib/style.css';
import Stories from './Stories';

new AreaChartPlugin().configure({ key: 'area' }).register();

export default {
  examples: [...Stories],
};
