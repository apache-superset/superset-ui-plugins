import TableChartPlugin from '../../../../superset-ui-legacy-plugin-chart-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import '../../../../superset-ui-legacy-plugin-chart-table/lib/style.css';
import Stories from './Stories';

new TableChartPlugin().configure({ key: 'table' }).register();

export default {
  examples: [...Stories],
};
