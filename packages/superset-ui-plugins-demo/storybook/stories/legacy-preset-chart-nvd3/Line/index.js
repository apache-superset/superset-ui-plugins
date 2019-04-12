import { LineChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-nvd3';
import Stories from './Stories';
import YAxisStories from './YAxisStories';
import LogStories from './LogStories';
import 'nvd3/build/nv.d3.min.css';
import '../../../../../superset-ui-legacy-preset-chart-nvd3/lib/style.css';

new LineChartPlugin().configure({ key: 'line' }).register();

export default {
  examples: [...Stories, ...YAxisStories, ...LogStories],
};
