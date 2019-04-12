import HeatmapChartPlugin from '../../../../superset-ui-legacy-plugin-chart-heatmap';
import '../../../../superset-ui-legacy-plugin-chart-heatmap/lib/style.css';
import Stories from './Stories';

new HeatmapChartPlugin().configure({ key: 'heatmap' }).register();

export default {
  examples: [...Stories],
};
