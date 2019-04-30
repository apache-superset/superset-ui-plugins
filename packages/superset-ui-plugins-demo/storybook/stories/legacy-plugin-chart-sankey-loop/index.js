import SankeyLoopChartPlugin from '../../../../superset-ui-legacy-plugin-chart-sankey-loop/src';
import Stories from './Stories';

new SankeyLoopChartPlugin().configure({ key: 'sankey-loop' }).register();

export default {
  examples: [...Stories],
};
