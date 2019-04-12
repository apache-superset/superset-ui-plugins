import PairedTTestChartPlugin from '../../../../superset-ui-legacy-plugin-chart-paired-t-test';
import '../../../../superset-ui-legacy-plugin-chart-paired-t-test/lib/style.css';
import Stories from './Stories';

new PairedTTestChartPlugin().configure({ key: 'paired-t-test' }).register();

export default {
  examples: [...Stories],
};
