import PivotTableChartPlugin from '../../../../superset-ui-legacy-plugin-chart-pivot-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import Stories from './Stories';

new PivotTableChartPlugin().configure({ key: 'pivot-table' }).register();

export default {
  examples: [...Stories],
};
