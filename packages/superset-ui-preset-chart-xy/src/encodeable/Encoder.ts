import { Value } from 'vega-lite/src/fielddef';
import ChannelEncoder from './ChannelEncoder';
import { ChannelDef, isFieldDef } from './types/fielddef';

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
    this.spec = this.createFullSpec(spec);
    this.channels = this.createChannels();
    this.legends = {};

    const blacklist = new Set(this.channelsWithoutLegend());
    (Object.keys(this.channels) as (keyof Encoding)[])
      .map<ChannelEncoder>((key: keyof Encoding) => this.channels[key])
      .filter((c: ChannelEncoder) => !blacklist.has(c.name as keyof Encoding) && c.hasLegend())
      .forEach((c: ChannelEncoder) => {
        if (isFieldDef(c.definition)) {
          const key = c.name as keyof Encoding;
          if (this.legends[c.definition.field]) {
            this.legends[c.definition.field].push(key);
          } else {
            this.legends[c.definition.field] = [key];
          }
        }
      });
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

    return new ChannelEncoder<OutputType>(`${name}`, def as ChannelDef<OutputType>, options);
  }

  /**
   * subclass should override this
   */
  protected createChannels() {
    return {} as { [key in keyof Encoding]: ChannelEncoder };
  }

  /**
   * subclass should override this
   */
  protected channelsWithoutLegend(): (keyof Encoding)[] {
    return [];
  }

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
