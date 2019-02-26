import { Value } from 'vega-lite/src/fielddef';
import ChannelEncoder from './ChannelEncoder';
import { ChannelDef, isFieldDef } from './types/fielddef';
import { FullSpec, BaseOptions, LooseSpec } from './types/spec';
import { ChannelOptions } from './types/channel';

type ObjectWithKeysFromAndValueType<T extends {}, V> = { [key in keyof T]: V };

export type ChannelOutputs<T> = ObjectWithKeysFromAndValueType<T, Value>;

export type BaseEncoding<Output extends ObjectWithKeysFromAndValueType<Output, Value>> = {
  [key in keyof Output]: ChannelDef<Output[key]>
};

export type Channels<
  Output extends ChannelOutputs<Encoding>,
  Encoding extends BaseEncoding<Output>
> = { readonly [k in keyof Output]: ChannelEncoder<Encoding[k], Output[k]> };

export default class BaseEncoder<
  Output extends ChannelOutputs<Encoding>,
  Encoding extends BaseEncoding<Output>,
  Options extends BaseOptions = BaseOptions
> {
  readonly spec: FullSpec<Encoding, Options>;
  readonly channels: Channels<Output, Encoding>;

  readonly legends: {
    [key: string]: (keyof Encoding)[];
  };

  constructor(spec: LooseSpec<Encoding, Options>, defaultEncoding?: Encoding) {
    this.spec = this.createFullSpec(spec, defaultEncoding);
    this.channels = this.createChannels();
    this.legends = {};

    (Object.keys(this.channels) as (keyof Encoding)[])
      .map((key: keyof Encoding) => this.channels[key])
      .filter(c => c.hasLegend())
      .forEach(c => {
        if (isFieldDef(c.definition)) {
          const key = c.name as keyof Encoding;
          const { field } = c.definition;
          if (this.legends[field]) {
            this.legends[field].push(key);
          } else {
            this.legends[field] = [key];
          }
        }
      });
  }

  /**
   * subclass can override this
   */
  protected createFullSpec(spec: LooseSpec<Encoding, Options>, defaultEncoding?: Encoding) {
    if (defaultEncoding === undefined) {
      return spec as FullSpec<Encoding, Options>;
    }

    const { encoding, ...rest } = spec;

    return {
      ...rest,
      encoding: {
        ...defaultEncoding,
        ...encoding,
      },
    };
  }

  protected createChannel<ChannelName extends keyof Output>(
    name: ChannelName,
    options?: ChannelOptions,
  ) {
    const { encoding } = this.spec;

    return new ChannelEncoder<Encoding[ChannelName], Output[ChannelName]>(
      `${name}`,
      encoding[name],
      {
        ...this.spec.options,
        ...options,
      },
    );
  }

  /**
   * subclass should override this
   */
  protected createChannels(): Channels<Output, Encoding> {
    return {} as Channels<Output, Encoding>;
  }

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
