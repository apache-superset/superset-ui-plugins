import ChordChartPlugin from '../../../../superset-ui-legacy-plugin-chart-chord';
import '../../../../superset-ui-legacy-plugin-chart-chord/lib/style.css';
import Stories from './Stories';

new ChordChartPlugin().configure({ key: 'chord' }).register();

export default {
  examples: [...Stories],
};
