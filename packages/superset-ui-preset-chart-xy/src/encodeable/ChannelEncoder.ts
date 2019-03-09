import { Value } from 'vega-lite/src/fielddef';
import { CategoricalColorScale } from '@superset-ui/color';
import { ChannelDef, Formatter } from './types';
import { PlainObject } from '../types';
import { BaseOptions } from './Encoder';
import parseScale from './parsers/parseScale';
import parseGetter from './parsers/parseGetter';
import parseFormat from './parsers/parseFormat';
import parseAxis from './parsers/parseAxis';

export default class ChannelEncoder<
  V extends Value = Value,
  Options extends BaseOptions = BaseOptions
> {
  name: string;
  axis?: PlainObject;
  scale?: CategoricalColorScale | ((x: any) => V);
  format: Formatter;

  get: (datum: PlainObject) => any;
  getAndEncode: (datum: PlainObject) => V;

  constructor(name: string, definition: ChannelDef, options?: Options) {
    this.name = name;
    this.get = parseGetter(definition);
    this.format = parseFormat(definition);
    const scale = parseScale(definition, options ? options.namespace : undefined);
    this.scale = scale;
    this.axis = parseAxis(name, definition, this.format);

    if (scale === undefined) {
      this.getAndEncode = this.get;
    } else {
      this.getAndEncode = (datum: PlainObject) => scale(this.get(datum));
    }
  }

  getOrElse(datum: PlainObject, otherwise: any) {
    const value = this.get(datum);

    return value === null || value === undefined ? otherwise : value;
  }
}
