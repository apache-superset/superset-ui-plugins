import ForceDirectedChartPlugin from '../../../../superset-ui-legacy-plugin-chart-force-directed';
import '../../../../superset-ui-legacy-plugin-chart-force-directed/lib/style.css';
import Stories from './Stories';

new ForceDirectedChartPlugin().configure({ key: 'force-directed' }).register();

export default {
  examples: [...Stories],
};
