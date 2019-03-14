import { ScaleType } from 'vega-lite/build/src/scale';
import { Value } from 'vega-lite/build/src/fielddef';

export { ScaleType, Value };

export interface Scale<V extends Value = Value> {
  type?: ScaleType;
  domain?: any[];
  range?: V[];
  scheme?: string;
}

export interface WithScale<V extends Value = Value> {
  scale?: Scale<V>;
}
