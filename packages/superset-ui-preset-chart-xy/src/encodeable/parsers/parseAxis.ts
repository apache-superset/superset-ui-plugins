import { cloneDeep } from 'lodash';
import { Axis } from 'vega-lite/src/axis';
import { ChannelDef, isPositionFieldDef, Formatter } from '../types';
import parseFormat from './parseFormat';
import { PlainObject } from '../../types';

export function isXY(channelName: string) {
  return channelName === 'x' || channelName === 'y';
}

function isAxis(axis: Axis | null | undefined | false): axis is Axis {
  return axis !== false && axis !== null && axis !== undefined;
}

export default function parseAxis(
  channelName: string,
  definition: ChannelDef,
  defaultFormatter: Formatter,
) {
  if (isXY(channelName) && isPositionFieldDef(definition)) {
    const { type, axis } = definition;
    if (isAxis(axis)) {
      const parsedAxis: PlainObject = cloneDeep(axis);
      const { labels } = parsedAxis;
      const { format } = labels;
      parsedAxis.format = format ? parseFormat({ format: axis.format, type }) : defaultFormatter;

      return parsedAxis;
    }
  }

  return undefined;
}
