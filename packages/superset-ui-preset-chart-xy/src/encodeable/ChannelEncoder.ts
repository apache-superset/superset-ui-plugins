import { Value } from 'vega-lite/src/fielddef';
import { CategoricalColorScale } from '@superset-ui/color';
import { ScaleOrdinal } from 'd3-scale';
import { TimeFormatter } from '@superset-ui/time-format';
import { NumberFormatter } from '@superset-ui/number-format';
import {
  ChannelDef,
  Formatter,
  isScaleFieldDef,
  isMarkPropFieldDef,
  isValueDef,
} from './types/fielddef';
import { PlainObject } from './types/data';
import parseScale from './parsers/parseScale';
import parseGetter from './parsers/parseGetter';
import parseFormat from './parsers/parseFormat';
import parseAxis, { isXY } from './parsers/parseAxis';
import isEnabled from './utils/isEnabled';
import isDisabled from './utils/isDisabled';
import { ChannelOptions } from './types/channel';
import identity from './utils/identity';

export default class ChannelEncoder<Def extends ChannelDef<V>, V extends Value = Value> {
  readonly name: string;
  readonly definition: Def;
  readonly options: ChannelOptions;

  readonly axis?: PlainObject;
  protected readonly getValue: (datum: PlainObject) => Value;
  readonly scale?: ScaleOrdinal<string, V> | CategoricalColorScale | ((x: any) => V);
  readonly formatter: Formatter;

  readonly encodeValue: (value: any) => V;
  readonly formatValue: (value: any) => string;

  constructor(name: string, definition: Def, options: ChannelOptions = {} as ChannelOptions) {
    this.name = name;
    this.definition = definition;
    this.options = options;

    this.getValue = parseGetter(definition);

    const formatter = parseFormat(definition);
    this.formatter = formatter;
    if (formatter instanceof NumberFormatter) {
      this.formatValue = (value: any) => formatter(value);
    } else if (formatter instanceof TimeFormatter) {
      this.formatValue = (value: any) => formatter(value);
    } else {
      this.formatValue = formatter;
    }

    const scale = parseScale<V>(definition, options.namespace);
    this.scale = scale;
    if (scale === undefined) {
      this.encodeValue = identity;
    } else if (scale instanceof CategoricalColorScale) {
      this.encodeValue = (value: any) => scale(`${value}`);
    } else {
      this.encodeValue = (value: any) => scale(value);
    }

    this.axis = parseAxis(name, definition, this.formatter);
  }

  get(datum: PlainObject, otherwise?: any) {
    const value = this.getValue(datum);

    return otherwise !== undefined && (value === null || value === undefined) ? otherwise : value;
  }

  encode(datum: PlainObject, otherwise?: V) {
    const output = this.encodeValue(this.get(datum));

    return otherwise !== undefined && (output === null || output === undefined)
      ? otherwise
      : output;
  }

  format(datum: PlainObject): string {
    return this.formatValue(this.get(datum));
  }

  hasLegend() {
    if (isDisabled(this.options.legend)) {
      return false;
    }
    if (isXY(this.name)) {
      return false;
    }
    if (isValueDef(this.definition)) {
      return false;
    }
    if (isMarkPropFieldDef(this.definition)) {
      return isEnabled(this.definition.legend);
    }

    return isScaleFieldDef(this.definition);
  }
}
