import { Value } from 'vega-lite/build/src/fielddef';
import { XFieldDef, YFieldDef, ChannelDef, MarkPropChannelDef, TextChannelDef } from './FieldDef';
import { ObjectWithKeysFromAndValueType } from './Base';

// eslint-disable-next-line import/prefer-default-export
export interface ChannelOptions {
  namespace?: string;
  legend?: boolean;
}

export interface ChannelTypeToDefMap<Output extends Value = Value>
  extends ObjectWithKeysFromAndValueType<ChannelTypeToDefMap<Output>, ChannelDef> {
  X: XFieldDef<Output>;
  Y: YFieldDef<Output>;
  MarkProp: MarkPropChannelDef<Output>;
  Text: TextChannelDef<Output>;
}

export type ChannelType = keyof ChannelTypeToDefMap;

export type ChannelDefFromType<
  T extends keyof ChannelTypeToDefMap,
  Output extends Value
> = ChannelTypeToDefMap<Output>[T];

export type EncodingFromChannelsAndOutputs<
  Channels extends ObjectWithKeysFromAndValueType<Outputs, ChannelType>,
  Outputs extends ObjectWithKeysFromAndValueType<Channels, Value>
> = { [key in keyof Channels]: ChannelDefFromType<Channels[key], Outputs[key]> };
