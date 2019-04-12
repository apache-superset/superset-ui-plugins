import { DistBarChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-nvd3';
import Stories from './Stories';
import ManyBarStories from './ManyBarStories';
import 'nvd3/build/nv.d3.min.css';
import '../../../../../superset-ui-legacy-preset-chart-nvd3/lib/style.css';

new DistBarChartPlugin().configure({ key: 'dist-bar' }).register();

export default {
  examples: [...Stories, ...ManyBarStories],
};
