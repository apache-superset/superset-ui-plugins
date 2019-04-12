import RoseChartPlugin from '../../../../superset-ui-legacy-plugin-chart-rose';
import '../../../../superset-ui-legacy-plugin-chart-rose/lib/style.css';
import Stories from './Stories';

new RoseChartPlugin().configure({ key: 'rose' }).register();

export default {
  examples: [...Stories],
};
