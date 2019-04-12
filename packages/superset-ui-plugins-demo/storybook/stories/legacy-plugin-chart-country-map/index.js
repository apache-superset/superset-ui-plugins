import CountryMapChartPlugin from '../../../../superset-ui-legacy-plugin-chart-country-map';
import '../../../../superset-ui-legacy-plugin-chart-country-map/lib/style.css';
import Stories from './Stories';

new CountryMapChartPlugin().configure({ key: 'country-map' }).register();

export default {
  examples: [...Stories],
};
