import { CategoricalColorNamespace } from '@superset-ui/color';
import { scaleOrdinal } from 'd3-scale';
import isEnabled from '../utils/isEnabled';
import { isScaleFieldDef, ChannelDef, isPositionFieldDef } from '../types/fielddef';
import { Value } from '../types/scale';

export default function parseScale<V extends Value = Value>(
  definition: ChannelDef<V>,
  namespace?: string,
) {
  if (isScaleFieldDef<V>(definition)) {
    const { scale, type } = definition;
    if (isEnabled(scale) && !isPositionFieldDef(definition)) {
      if (scale) {
        const { domain, range, scheme } = scale;
        if (type === 'nominal') {
          if (scheme) {
            return CategoricalColorNamespace.getScale(scheme, namespace);
          }

          const scaleFn = scaleOrdinal<any, V>();
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
