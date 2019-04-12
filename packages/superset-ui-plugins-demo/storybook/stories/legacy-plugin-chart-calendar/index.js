import CalendarChartPlugin from '../../../../superset-ui-legacy-plugin-chart-calendar';
import '../../../../superset-ui-legacy-plugin-chart-calendar/lib/style.css';
import Stories from './Stories';

new CalendarChartPlugin().configure({ key: 'calendar' }).register();

export default {
  examples: [...Stories],
};
