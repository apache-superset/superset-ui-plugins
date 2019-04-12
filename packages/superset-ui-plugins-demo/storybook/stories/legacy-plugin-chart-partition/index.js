import PartitionChartPlugin from '../../../../superset-ui-legacy-plugin-chart-partition';
import '../../../../superset-ui-legacy-plugin-chart-partition/lib/style.css';
import Stories from './Stories';

new PartitionChartPlugin().configure({ key: 'partition' }).register();

export default {
  examples: [...Stories],
};
