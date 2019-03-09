import { Value } from 'vega-lite/src/fielddef';
import { CategoricalColorScale } from '@superset-ui/color';
import { ScaleOrdinal } from 'd3-scale';
import {
  ChannelDef,
  Formatter,
  isScaleFieldDef,
  isMarkPropFieldDef,
  isValueDef,
} from './types/fielddef';
import { PlainObject } from '../types';
import { BaseOptions } from './Encoder';
import parseScale from './parsers/parseScale';
import parseGetter from './parsers/parseGetter';
import parseFormat from './parsers/parseFormat';
import parseAxis, { isXY } from './parsers/parseAxis';
import isEnabled from './utils/isEnabled';

export default class ChannelEncoder<
  V extends Value = Value,
  Options extends BaseOptions = BaseOptions
> {
  definition: ChannelDef<V>;
  name: string;
  axis?: PlainObject;
  scale?: ScaleOrdinal<string, V> | CategoricalColorScale | ((x: any) => V);
  format: Formatter;

  get: (datum: PlainObject) => Value;
  getAndEncode: (datum: PlainObject) => V;

  constructor(name: string, definition: ChannelDef<V>, options?: Options) {
    this.definition = definition;
    this.name = name;
    this.get = parseGetter(definition);
    this.format = parseFormat(definition);
    const scale = parseScale<V>(definition, options ? options.namespace : undefined);
    this.scale = scale;
    this.axis = parseAxis(name, definition, this.format);

    if (scale === undefined) {
      this.getAndEncode = (datum: PlainObject) => this.get(datum) as V;
    } else {
      this.getAndEncode = (datum: PlainObject) => {
        const value = this.get(datum);
        if (scale instanceof CategoricalColorScale) {
          return scale(`${value}`);
        }

        return scale(value) as V;
      };
    }
  }

  getOrElse(datum: PlainObject, otherwise: any) {
    const value = this.get(datum);

    return value === null || value === undefined ? otherwise : value;
  }

  hasLegend() {
    if (isValueDef(this.definition)) {
      return false;
    }
    if (isXY(this.name)) {
      return false;
    }
    if (isMarkPropFieldDef(this.definition)) {
      return isEnabled(this.definition.legend);
    }

    return isScaleFieldDef(this.definition);
  }
}
