import { Value } from 'vega-lite/build/src/fielddef';
import { CategoricalColorScale } from '@superset-ui/color';
import { ScaleOrdinal } from 'd3-scale';
import {
  ChannelDef,
  isScaleFieldDef,
  isMarkPropFieldDef,
  isValueDef,
  isFieldDef,
  isNonValueDef,
  isPositionFieldDef,
} from './types/FieldDef';
import { PlainObject } from './types/Data';
import extractScale from './parsers/extractScale';
import extractGetter from './parsers/extractGetter';
import { extractFormatFromChannelDef } from './parsers/extractFormat';
import isEnabled from './utils/isEnabled';
import isDisabled from './utils/isDisabled';
import { ChannelOptions, ChannelType } from './types/Channel';
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
  readonly scale?: ScaleOrdinal<string, Output> | CategoricalColorScale | ((x: any) => Output);
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
      const scale = extractScale<Output>(definition, options.namespace);
      if (scale instanceof CategoricalColorScale) {
        this.encodeValue = (value: any) => scale(value);
      } else {
        this.encodeValue = (value: any) => scale(value);
      }
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

  // private extractScale() {
  //   if (isNonValueDef(this.definition)) {
  //     if (
  //       'scale' in this.definition &&
  //       typeof this.definition.scale !== 'undefined' &&
  //       isDisabled(this.definition.scale)
  //     ) {
  //       return identity;
  //     }
  //     const { scale, type } = this.definition;
  //     if (this.isXY()) {
  //       // TODO
  //       return identity;
  //     } else if (type === 'nominal') {
  //       const { domain, range, scheme } = scale;
  //       if (scheme) {
  //         return CategoricalColorNamespace.getScale(scheme, namespace);
  //       }

  //       const scaleFn = scaleOrdinal<any, Output>();
  //       if (domain) {
  //         scaleFn.domain(domain);
  //       }
  //       if (range) {
  //         scaleFn.range(range);
  //       }

  //       return scaleFn;
  //     }
  //   }

  //   return identity;
  // }

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
