import { CategoricalColorNamespace } from '@superset-ui/color';
import { scaleOrdinal } from 'd3-scale';
import { Value } from 'vega-lite/build/src/fielddef';
import { isPositionFieldDef, NonValueDef } from '../types/FieldDef';
import identity from '../utils/identity';
import isEnabled from '../utils/isEnabled';

export default function extractScale<Output extends Value = Value>(
  definition: NonValueDef<Output>,
  namespace?: string,
) {
  if (
    'scale' in definition &&
    typeof definition.scale !== 'undefined' &&
    isEnabled(definition.scale) &&
    !isPositionFieldDef(definition)
  ) {
    const { scale, type } = definition;
    if (scale) {
      const { domain, range, scheme } = scale;
      if (type === 'nominal') {
        if (scheme) {
          return CategoricalColorNamespace.getScale(scheme, namespace);
        }

        const scaleFn = scaleOrdinal<any, Output>();
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

  return identity;
}
