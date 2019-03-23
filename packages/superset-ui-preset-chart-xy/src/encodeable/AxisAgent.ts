/* eslint-disable no-magic-numbers */
import { Value } from 'vega-lite/build/src/fielddef';
import { extractFormatFromTypeAndFormat } from './parsers/extractFormat';
import { XAxis, YAxis } from './types/Axis';
import { PositionFieldDef, ChannelDef } from './types/FieldDef';
import ChannelEncoder from './ChannelEncoder';

export default class AxisAgent<Def extends ChannelDef<Output>, Output extends Value = Value> {
  private readonly channelEncoder: ChannelEncoder<Def, Output>;
  private readonly format?: (value: any) => string;
  readonly config: XAxis | YAxis;

  constructor(channelEncoder: ChannelEncoder<Def, Output>) {
    this.channelEncoder = channelEncoder;
    const definition = channelEncoder.definition as PositionFieldDef;
    const { type, axis = {} } = definition;
    this.config = { ...axis };

    if (typeof axis.format !== 'undefined') {
      this.format = extractFormatFromTypeAndFormat(type, axis.format);
    }
  }

  getFormat() {
    return this.format || this.channelEncoder.formatValue;
  }

  getTitle() {
    return this.config.title || this.channelEncoder.getTitle();
  }

  getTickLabels(scale: {
    ticks(num?: number): string[] | number[];
    domain(): any[];
    tickFormat(count?: number, specifier?: string): (d: number | { valueOf(): number }) => string;
  }) {
    const { tickCount = 5, values } = this.config;

    const format = this.getFormat();
    if (typeof values !== 'undefined') {
      return (values as any[]).map(format);
    }

    // TODO: switch to this
    // const { scale } = this.channelEncoder;
    if (typeof scale !== 'undefined') {
      return (typeof scale.ticks === 'undefined' ? scale.domain() : scale.ticks(tickCount)).map(
        format,
      );
    }

    return [];
  }
}
