import { MarkPropChannelDef, XFieldDef, YFieldDef } from '../encodeable/types/fielddef';
import BaseEncoder from '../encodeable/BaseEncoder';
import { LooseSpec } from '../encodeable/types/spec';

/**
 * Define output type for each channel
 */
export interface Output {
  x: number | null;
  y: number | null;
  color: string;
  fill: boolean;
  strokeDasharray: string;
}

/**
 * Define encoding config for each channel
 */
export interface Encoding {
  x: XFieldDef;
  y: YFieldDef;
  color: MarkPropChannelDef<Output['color']>;
  fill: MarkPropChannelDef<Output['fill']>;
  strokeDasharray: MarkPropChannelDef<Output['strokeDasharray']>;
}

export default class Encoder extends BaseEncoder<Output, Encoding> {
  static DEFAULT_ENCODINGS: Encoding = {
    color: { value: '#222' },
    fill: { value: false },
    strokeDasharray: { value: '' },
    x: { field: 'x', type: 'quantitative' },
    y: { field: 'y', type: 'quantitative' },
  };

  constructor(spec: LooseSpec<Encoding>) {
    super(spec, Encoder.DEFAULT_ENCODINGS);
  }

  createChannels() {
    return {
      color: this.createChannel<'color'>('color'),
      fill: this.createChannel<'fill'>('fill', { legend: false }),
      strokeDasharray: this.createChannel<'strokeDasharray'>('strokeDasharray'),
      x: this.createChannel<'x'>('x'),
      y: this.createChannel<'y'>('y'),
    };
  }
}
