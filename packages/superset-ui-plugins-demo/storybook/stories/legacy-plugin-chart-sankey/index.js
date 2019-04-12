import SankeyChartPlugin from '../../../../superset-ui-legacy-plugin-chart-sankey';
import '../../../../superset-ui-legacy-plugin-chart-sankey/lib/style.css';
import Stories from './Stories';

new SankeyChartPlugin().configure({ key: 'sankey' }).register();

export default {
  examples: [...Stories],
};
