import { Value } from 'vega-lite/build/src/fielddef';
import ChannelEncoder from './ChannelEncoder';
import { ChannelOptions } from './types/Channel';
import { ChannelDef, isFieldDef } from './types/FieldDef';
import { FullSpec, BaseOptions, PartialSpec } from './types/Spec';

type ObjectWithKeysFromAndValueType<T extends {}, V> = { [key in keyof T]: V };

export type ChannelOutputs<T> = ObjectWithKeysFromAndValueType<T, Value>;

export type BaseEncoding<Output extends ObjectWithKeysFromAndValueType<Output, Value>> = {
  [key in keyof Output]: ChannelDef<Output[key]>
};

export type Channels<
  Output extends ChannelOutputs<Encoding>,
  Encoding extends BaseEncoding<Output>
> = { readonly [k in keyof Output]: ChannelEncoder<Encoding[k], Output[k]> };

export default abstract class AbstractEncoder<
  Output extends ChannelOutputs<Encoding>,
  Encoding extends BaseEncoding<Output>,
  Options extends BaseOptions = BaseOptions
> {
  readonly spec: FullSpec<Encoding, Options>;
  readonly channels: Channels<Output, Encoding>;

  readonly legends: {
    [key: string]: (keyof Encoding)[];
  };

  constructor(spec: PartialSpec<Encoding, Options>, defaultEncoding?: Encoding) {
    this.spec = this.createFullSpec(spec, defaultEncoding);
    this.channels = this.createChannels();
    this.legends = {};

    // Group the channels that use the same field together
    // so they can share the same legend.
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
  protected createFullSpec(spec: PartialSpec<Encoding, Options>, defaultEncoding?: Encoding) {
    if (typeof defaultEncoding === 'undefined') {
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
  protected abstract createChannels(): Channels<Output, Encoding>;

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
