import { CategoricalColorNamespace } from '@superset-ui/color';
import { scaleOrdinal } from 'd3-scale';
import isEnabled from '../utils/isEnabled';
import { isScaleFieldDef, ChannelDef } from '../types';

export default function parseScale(definition: ChannelDef, namespace?: string) {
  if (isScaleFieldDef(definition)) {
    const { scale, type } = definition;
    if (isEnabled(scale)) {
      if (scale) {
        const { domain, range, scheme } = scale;
        if (type === 'nominal') {
          if (scheme) {
            return CategoricalColorNamespace.getScale(scheme, namespace);
          }

          const scaleFn = scaleOrdinal();
          if (domain) {
            scaleFn.domain(domain);
          }
          if (range) {
            scaleFn.range(range);
          }

          return scaleFn;
        }
      } else if (type === 'nominal') {
        return CategoricalColorNamespace.getScale(undefined, namespace);
      }
    }
  }

  return undefined;
}
