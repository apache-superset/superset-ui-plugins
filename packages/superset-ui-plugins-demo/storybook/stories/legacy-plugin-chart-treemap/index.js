import TreemapChartPlugin from '../../../../superset-ui-legacy-plugin-chart-treemap';
import '../../../../superset-ui-legacy-plugin-chart-treemap/lib/style.css';
import Stories from './Stories';

new TreemapChartPlugin().configure({ key: 'treemap' }).register();

export default {
  examples: [...Stories],
};
