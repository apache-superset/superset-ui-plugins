import { ChartPlugin } from '@superset-ui/chart';
import createMetadata from './createMetadata';
import transformProps from './transformProps';

export default class IcicleEventVizPlugin extends ChartPlugin {
  constructor() {
    super({
      loadChart: () => import('./IcicleEventViz'),
      metadata: createMetadata(),
      transformProps,
    });
  }
}
