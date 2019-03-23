import { Value } from 'vega-lite/build/src/fielddef';
import { extractFormatFromChannelDef } from './parsers/extractFormat';
import extractScale, { ScaleAgent } from './parsers/extractScale';
import extractGetter from './parsers/extractGetter';
import { ChannelOptions, ChannelType } from './types/Channel';
import { PlainObject } from './types/Data';
import {
  ChannelDef,
  isScaleFieldDef,
  isMarkPropFieldDef,
  isValueDef,
  isFieldDef,
  isNonValueDef,
  isPositionFieldDef,
} from './types/FieldDef';
import isEnabled from './utils/isEnabled';
import isDisabled from './utils/isDisabled';
import identity from './utils/identity';
import AxisAgent from './AxisAgent';

export default class ChannelEncoder<Def extends ChannelDef<Output>, Output extends Value = Value> {
  readonly name: string | Symbol | number;
  readonly type: ChannelType;
  readonly definition: Def;
  readonly options: ChannelOptions;

  protected readonly getValue: (datum: PlainObject) => Value;
  readonly encodeValue: (value: any) => Output;
  readonly formatValue: (value: any) => string;
  readonly scale?: ScaleAgent<Output>;
  readonly axis?: AxisAgent<Def, Output>;

  constructor({
    name,
    type,
    definition,
    options = {},
  }: {
    name: string | Symbol | number;
    type: ChannelType;
    definition: Def;
    options?: ChannelOptions;
  }) {
    this.name = name;
    this.type = type;
    this.definition = definition;
    this.options = options;

    this.getValue = extractGetter(definition);
    this.formatValue = extractFormatFromChannelDef(definition);

    if (isNonValueDef(definition)) {
      const scale = extractScale(this.type, definition, options.namespace);
      this.encodeValue = scale ? scale.encodeValue : identity;
      this.scale = scale;
      this.axis = this.extractAxis();
    } else {
      this.encodeValue = identity;
    }

    this.format = this.format.bind(this);
  }

  encode(datum: PlainObject, otherwise?: Output) {
    const output = this.encodeValue(this.get(datum));

    return otherwise !== undefined && (output === null || output === undefined)
      ? otherwise
      : output;
  }

  private extractAxis() {
    return this.isXY() && isPositionFieldDef(this.definition) && isEnabled(this.definition.axis)
      ? new AxisAgent<Def, Output>(this, this.definition)
      : undefined;
  }

  format(datum: PlainObject): string {
    return this.formatValue(this.get(datum));
  }

  get(datum: PlainObject, otherwise?: any) {
    const value = this.getValue(datum);

    return otherwise !== undefined && (value === null || value === undefined) ? otherwise : value;
  }

  getTitle() {
    if (isFieldDef(this.definition)) {
      return this.definition.title || this.definition.field;
    }

    return undefined;
  }

  hasLegend() {
    if (isDisabled(this.options.legend) || this.isXY() || isValueDef(this.definition)) {
      return false;
    }
    if (isMarkPropFieldDef(this.definition)) {
      return isEnabled(this.definition.legend);
    }

    return isScaleFieldDef(this.definition);
  }

  isXY() {
    return this.type === 'X' || this.type === 'Y';
  }
}
