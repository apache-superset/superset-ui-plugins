import {
  PositionChannelDef,
  ScaleChannelDefWithLegend,
  ScaleChannelDefWithoutLegend,
} from '../encodeable/types';
import Encoder, { LooseSpec } from '../encodeable/Encoder';

export namespace Output {
  export type x = number;
  export type y = number;
  export type color = string;
  export type fill = boolean;
  export type strokeDasharray = string;
}

export interface Encoding {
  x: PositionChannelDef;
  y: PositionChannelDef;
  color: ScaleChannelDefWithLegend<Output.color>;
  fill: ScaleChannelDefWithoutLegend<Output.fill>;
  strokeDasharray: ScaleChannelDefWithLegend<Output.strokeDasharray>;
}

export default class LineChartEncoder extends Encoder<Encoding> {
  static DEFAULT_ENCODINGS: Encoding = {
    color: { value: '#222' },
    fill: { value: false },
    strokeDasharray: { value: '' },
    x: { field: 'x', type: 'quantitative' },
    y: { field: 'y', type: 'quantitative' },
  };

  createFullSpec(spec: LooseSpec<Encoding>) {
    return {
      ...spec,
      encoding: {
        ...spec.encoding,
        ...LineChartEncoder.DEFAULT_ENCODINGS,
      },
    };
  }

  createChannels() {
    return {
      color: this.createChannel<Output.color>('color'),
      fill: this.createChannel<Output.fill>('fill'),
      strokeDasharray: this.createChannel<Output.strokeDasharray>('strokeDasharray'),
      x: this.createChannel<Output.x>('x'),
      y: this.createChannel<Output.y>('y'),
    };
  }
}
