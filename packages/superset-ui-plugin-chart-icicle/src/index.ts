import { ChartPlugin } from '@superset-ui/chart';
import createMetadata from './createMetadata';
import transformProps from './transformProps';

export default class IcicleChartPlugin extends ChartPlugin {
  constructor() {
    super({
      loadChart: () => import('./Icicle'),
      metadata: createMetadata(),
      transformProps,
    });
  }
}
