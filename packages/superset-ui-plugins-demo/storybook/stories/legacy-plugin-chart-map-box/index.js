import MapBoxChartPlugin from '../../../../superset-ui-legacy-plugin-chart-map-box';
import 'mapbox-gl/dist/mapbox-gl.css';

import Stories from './Stories';

new MapBoxChartPlugin().configure({ key: 'map-box' }).register();

export default {
  examples: [...Stories],
};
