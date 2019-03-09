import { MarkPropChannelDef, XFieldDef, YFieldDef } from '../encodeable/types/fielddef';
import Encoder, { LooseSpec } from '../encodeable/Encoder';

export namespace Output {
  export type x = number;
  export type y = number;
  export type color = string;
  export type fill = boolean;
  export type strokeDasharray = string;
}

export interface Encoding {
  x: XFieldDef;
  y: YFieldDef;
  color: MarkPropChannelDef<Output.color>;
  fill: MarkPropChannelDef<Output.fill>;
  strokeDasharray: MarkPropChannelDef<Output.strokeDasharray>;
}

export default class LineChartEncoder extends Encoder<Encoding> {
  static DEFAULT_ENCODINGS: Encoding = {
    color: { value: '#222' },
    fill: { value: false },
    strokeDasharray: { value: '' },
    x: { field: 'x', type: 'quantitative' },
    y: { field: 'y', type: 'quantitative' },
  };

  protected createFullSpec(spec: LooseSpec<Encoding>) {
    const { encoding, ...rest } = spec;

    return {
      ...rest,
      encoding: {
        ...LineChartEncoder.DEFAULT_ENCODINGS,
        ...encoding,
      },
    };
  }

  protected createChannels() {
    return {
      color: this.createChannel<Output.color>('color'),
      fill: this.createChannel<Output.fill>('fill'),
      strokeDasharray: this.createChannel<Output.strokeDasharray>('strokeDasharray'),
      x: this.createChannel<Output.x>('x'),
      y: this.createChannel<Output.y>('y'),
    };
  }

  protected channelsWithoutLegend(): (keyof Encoding)[] {
    return ['fill'];
  }
}
