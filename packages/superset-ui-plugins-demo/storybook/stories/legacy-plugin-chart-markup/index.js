import MarkupChartPlugin from '../../../../superset-ui-legacy-plugin-chart-markup';
import '../../../../superset-ui-legacy-plugin-chart-markup/lib/style.css';
import Stories from './Stories';

new MarkupChartPlugin().configure({ key: 'markup' }).register();

export default {
  examples: [...Stories],
};
