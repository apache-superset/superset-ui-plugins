import HorizonChartPlugin from '../../../../superset-ui-legacy-plugin-chart-horizon';
import '../../../../superset-ui-legacy-plugin-chart-horizon/lib/style.css';
import Stories from './Stories';

new HorizonChartPlugin().configure({ key: 'horizon' }).register();

export default {
  examples: [...Stories],
};
