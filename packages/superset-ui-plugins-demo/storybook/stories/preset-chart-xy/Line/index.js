import { LineChartPlugin as LegacyLineChartPlugin } from '../../../../../superset-ui-preset-chart-xy/src/legacy';
import { LineChartPlugin } from '../../../../../superset-ui-preset-chart-xy/src';
import BasicStories from './stories/basic';
import LegacyStories from './stories/legacy';
import MissingStories from './stories/missing';
import TimeShiftStories from './stories/timeShift';

new LegacyLineChartPlugin().configure({ key: 'v2-line/legacy' }).register();
new LineChartPlugin().configure({ key: 'v2-line' }).register();

export default {
  examples: [...BasicStories, ...MissingStories, ...TimeShiftStories, ...LegacyStories],
};
