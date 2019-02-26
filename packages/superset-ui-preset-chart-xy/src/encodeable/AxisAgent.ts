/* eslint-disable no-magic-numbers */
import { Value } from 'vega-lite/build/src/fielddef';
import { PositionFieldDef, ChannelDef } from './types/FieldDef';
import { extractFormatFromTypeAndFormat } from './parsers/extractFormat';
import ChannelEncoder from './ChannelEncoder';
import { XAxis, YAxis } from './types/Axis';

export default class AxisAgent<Def extends ChannelDef<Output>, Output extends Value = Value> {
  private readonly channelEncoder: ChannelEncoder<Def, Output>;
  private readonly format?: (value: any) => string;
  readonly config: XAxis | YAxis;

  constructor(channelEncoder: ChannelEncoder<Def, Output>, definition: PositionFieldDef) {
    const { type, axis = {} } = definition;

    this.channelEncoder = channelEncoder;
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

    // const { scale } = this.channelEncoder;
    if (typeof scale !== 'undefined') {
      return (typeof scale.ticks === 'undefined' ? scale.domain() : scale.ticks(tickCount)).map(
        format,
      );
    }

    return [];
  }
}
