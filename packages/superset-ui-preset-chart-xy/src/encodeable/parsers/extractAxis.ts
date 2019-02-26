import { Axis } from 'vega-lite/build/src/axis';
import { Value } from 'vega-lite/build/src/fielddef';
import { ChannelDef, isPositionFieldDef } from '../types/FieldDef';
import AxisAgent from '../AxisAgent';
import ChannelEncoder from '../ChannelEncoder';
import isEnabled from '../utils/isEnabled';

function isAxisEnabled(axis: any): axis is Axis {
  return isEnabled(axis);
}

export default function extractAxis<Def extends ChannelDef<Output>, Output extends Value = Value>(
  channel: ChannelEncoder<Def, Output>,
) {
  if (
    channel.isXY() &&
    isPositionFieldDef(channel.definition) &&
    isAxisEnabled(channel.definition.axis)
  ) {
    return new AxisAgent(channel, channel.definition);
  }

  return undefined;
}
