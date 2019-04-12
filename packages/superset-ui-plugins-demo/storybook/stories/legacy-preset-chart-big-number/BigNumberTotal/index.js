import { BigNumberTotalChartPlugin } from '../../../../../superset-ui-legacy-preset-chart-big-number';
import '../../../../../superset-ui-legacy-preset-chart-big-number/lib/style.css';
import Stories from './Stories';

new BigNumberTotalChartPlugin().configure({ key: 'big-number-total' }).register();

export default {
  examples: [...Stories],
};
