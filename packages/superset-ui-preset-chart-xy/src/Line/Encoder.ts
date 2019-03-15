import { MarkPropChannelDef, XFieldDef, YFieldDef } from '../encodeable/types/FieldDef';
import AbstractEncoder from '../encodeable/AbstractEncoder';
import { PartialSpec } from '../encodeable/types/Spec';

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

export default class Encoder extends AbstractEncoder<Output, Encoding> {
  static DEFAULT_ENCODINGS: Encoding = {
    color: { value: '#222' },
    fill: { value: false },
    strokeDasharray: { value: '' },
    x: { field: 'x', type: 'quantitative' },
    y: { field: 'y', type: 'quantitative' },
  };

  constructor(spec: PartialSpec<Encoding>) {
    super(spec, Encoder.DEFAULT_ENCODINGS);
  }

  createChannels() {
    return {
      color: this.createChannel('color'),
      fill: this.createChannel('fill', { legend: false }),
      strokeDasharray: this.createChannel('strokeDasharray'),
      x: this.createChannel('x'),
      y: this.createChannel('y'),
    };
  }
}
