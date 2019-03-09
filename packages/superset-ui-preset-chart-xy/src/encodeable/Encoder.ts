import { Value } from 'vega-lite/src/fielddef';
import ChannelEncoder from './ChannelEncoder';
import { ChannelDef } from './types';

export interface BaseOptions {
  namespace?: string;
}

export interface LooseSpec<Encoding, Options extends BaseOptions = BaseOptions> {
  encoding: Partial<Encoding>;
  options?: Options;
}

export interface FullSpec<Encoding, Options extends BaseOptions = BaseOptions> {
  encoding: Encoding;
  options?: Options;
}

export default class Encoder<Encoding, Options extends BaseOptions = BaseOptions> {
  spec: FullSpec<Encoding, Options>;

  channels: { [key in keyof Encoding]: ChannelEncoder };

  legends: {
    [key: string]: (keyof Encoding)[];
  };

  constructor(spec: LooseSpec<Encoding, Options>) {
    this.legends = {};
    this.spec = this.createFullSpec(spec);
    this.channels = this.createChannels();
  }

  /**
   * subclass should override this
   */
  protected createFullSpec(spec: LooseSpec<Encoding, Options>) {
    return spec as FullSpec<Encoding, Options>;
  }

  protected createChannel<OutputType extends Value>(name: keyof Encoding) {
    const { encoding, options } = this.spec;
    const def: unknown = encoding[name];

    return new ChannelEncoder<OutputType>(`${name}`, def as ChannelDef<Value>, options);
  }

  /**
   * subclass should override this
   */
  protected createChannels() {
    return {} as { [key in keyof Encoding]: ChannelEncoder };
  }

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
