import GroupedChartPlugin from '../../../../superset-ui-legacy-plugin-grouped-column-line-chart';
import Stories from './Stories';

new GroupedChartPlugin().configure({key: 'grouped_column_line_chart'}).register();

export default {
  examples: [...Stories],
};
