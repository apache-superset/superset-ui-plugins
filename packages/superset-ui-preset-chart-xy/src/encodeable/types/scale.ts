import { ScaleType } from 'vega-lite/src/scale';
import { Value } from 'vega-lite/src/fielddef';

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
