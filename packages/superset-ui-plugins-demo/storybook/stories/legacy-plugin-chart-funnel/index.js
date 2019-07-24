import FunnelChartPlugin from '../../../../superset-ui-legacy-plugin-chart-funnel';
import Stories from './Stories';

new FunnelChartPlugin().configure({ key: 'funnel' }).register();

export default {
  examples: [...Stories],
};
